import { GuildChannel, Message } from 'discord.js'
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
  const locale = (phrase: string, ...args: any[]) =>
    client.locale.__({ locale: user?.locale || 'ko_KR', phrase }, ...args)

  if (!msg.guild) {
    return author.send(locale('dm_disallow')).catch()
  }

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

  if (client.config.koreanbots?.enable) {
    if (!cache.includes(msg.author.id)) {
      const { status, body } =
        await get(client.config.koreanbots.baseURL + '/bots/voted/' + msg.author.id)
          .set('token', client.config.koreanbots.token)
          .catch(() => { return { status: 400, body: {} } })

      if (status !== 200) target.default(client, msg, query, locale)
      else if (body.voted) {
        cache.push(msg.author.id)
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
