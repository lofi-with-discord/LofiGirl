import { EmbedField, GuildChannel, Message } from 'discord.js'
import { get } from 'superagent'
import Client from '../classes/Client'
import { DefaultEmbed, hasPermissions } from '../utils'
import Query from './../classes/Query'

const cache: string[] = []

/**
 * @param {import('../classes/Client')} client
 * @param {import('discord.js').Message} msg
 */
export default async function onMessage (client: Client, msg: Message) {
  const { prefix } = client.config
  const { author, content } = msg

  if (author.bot) return
  if (!client.user) return

  const [user] = await client.db.select('*').from('users').where('id', author.id)
  let locale = (phrase: string, ...args: any[]) =>
    client.locale.__({ locale: user?.locale || 'ko_KR', phrase }, ...args)

  if (!msg.guild) return author.send(locale('dm_disallow')).catch()

  const channel = msg.channel as GuildChannel
  if (!channel.permissionsFor(client.user.id)?.has('SEND_MESSAGES')) return

  if (msg.mentions.has(client.user, { ignoreEveryone: true, ignoreRoles: true })) {
    const m = await msg.channel.send(locale('mention_call_1'))
    setTimeout(() => m.edit(locale('mention_call_2', prefix)), 500)
    return
  }

  if (!content.startsWith(prefix)) return

  const query = new Query(prefix, content)
  const target = client.commands.find((command) => command.aliases.includes(query.cmd))

  if (!target) return
  if (!user) {
    const perm = hasPermissions(client.user.id, channel, ['ADD_REACTIONS', 'EMBED_LINKS'])
    if (perm) {
      const embed = new DefaultEmbed('oobe', null, {
        title: 'Select a language',
        fields: client.locale.getLocales().reduce((prev, curr) =>
          [...prev, {
            name:
              client.locale.__({ phrase: 'flag', locale: curr }) + ' ' +
              client.locale.__({ phrase: 'locale', locale: curr }),
            value: client.locale.__({ phrase: 'translaters', locale: curr }),
            inline: true
          }], [] as EmbedField[])
      })

      const m = await msg.channel.send(embed)
      const flags = client.locale.__l('flag')

      flags.forEach((flag) => m.react(flag))
      const collected = await m.awaitReactions((r, u) => flags.includes(r.emoji.name) && u.id === author.id, { max: 1 })

      if (!collected.first()) return
      const choice = Object.keys(client.locale.__h('flag').find((flag) => Object.values(flag)[0] === collected.first()?.emoji.name)!)[0]

      await client.db.insert({ id: author.id, locale: choice }).into('users')

      locale = (phrase: string, ...args: any[]) =>
        client.locale.__({ locale: choice, phrase }, ...args)
    } else {
      const m = await msg.channel.send(
        '**Select a language**\n\n' +
        client.locale.__h('flag').reduce((prev, curr) => {
          const localeId = Object.keys(curr)[0]
          const flag = curr[localeId]

          return [...prev, `${flag} ${client.locale.__({ phrase: 'locale', locale: localeId })} (\`${client.config.prefix}locale ${localeId}\`)\n- ${client.locale.__({ phrase: 'translaters', locale: localeId })}`]
        }, [] as string[]).join('\n\n'))

      const collected = await m.channel.awaitMessages((m) => m.author.id === author.id && m.content.startsWith(`${client.config.prefix}locale `) && client.locale.getLocales().includes(m.content.split(' ')[1]), { max: 1 })
      if (!collected.first()) return

      const [, choice] = collected.first()!.content.split(' ')
      await client.db.insert({ id: author.id, locale: choice }).into('users')

      locale = (phrase: string, ...args: any[]) =>
        client.locale.__({ locale: choice, phrase }, ...args)
    }
  }

  if (client.config.koreanbots?.enable) {
    if (!cache.includes(msg.author.id)) {
      const { status, body } =
        await get(client.config.koreanbots.baseURL + '/vote?userID=' + msg.author.id)
          .set('Authorization', client.config.koreanbots.token)
          .catch((err) => { console.log(err); return { status: 400, body: { } } })

      if (status !== 200) target.default(client, msg, query, locale)
      else if (body.data.voted) {
        const index = cache.push(msg.author.id) - 1
        setTimeout(() => cache.splice(index), 24 * 60 * 60 * 1000)
        target.default(client, msg, query, locale)
      } else {
        if (hasPermissions(client.user.id, channel, ['EMBED_LINKS'])) {
          const embed = new DefaultEmbed('welcome', null, {
            title: locale('give_me_heart_title'),
            description:
              locale('give_me_heart_description') + '\n\n' +
              locale('give_me_heart_button_1', client.config.koreanbots.profileURL) + ' • ' +
              locale('give_me_heart_button_2', 'https://github.com/lofi-with-discord/LofiGirl')
          })
          msg.channel.send(embed)
        } else {
          msg.channel.send(locale('give_me_heart_no_embed', client.config.koreanbots.profileURL))
        }
      }
    } else target.default(client, msg, query, locale)
  } else target.default(client, msg, query, locale)
}
