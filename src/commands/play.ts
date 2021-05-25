import { GuildChannel, Message } from 'discord.js'
import Client from '../classes/Client'
import Query from '../classes/Query'
import { Locale } from '../types'
import { DefaultEmbed, getYtInfo, hasPermissions } from '../utils'

export default async function (client: Client, msg: Message, query: Query, locale: Locale) {
  if (!msg.guild) return
  if (!msg.member) return
  if (!msg.member.voice.channel) return msg.channel.send(locale('play_no_voice'))
  if (!msg.member.voice.channel.joinable) return msg.channel.send(locale('play_not_joinable'))
  if (!msg.member.voice.channel.speakable) return msg.channel.send(locale('play_not_speakable'))

  const userAt = msg.member.voice.channel
  const meAt = msg.guild.me?.voice?.channel

  if (meAt) {
    if (meAt.id === userAt.id) meAt.leave()
    else if (meAt.members.size > 1) meAt.leave()
    else if (hasPermissions(msg.author.id, meAt, ['MOVE_MEMBERS'])) {
      const m = await msg.channel.send(locale('play_force_question', meAt.name))

      if (hasPermissions(client.user?.id!, msg.channel as GuildChannel, ['ADD_REACTIONS'])) {
        m.react('✅')
        await m.awaitReactions((react, user) => react.emoji.name === '✅' && user.id === msg.author.id, { max: 1 })
      } else {
        msg.channel.send(locale('play_force_no_react', client.config.prefix))
        await msg.channel.awaitMessages((message, user) => message.content === locale('play_force_no_react_answer', client.config.prefix) && user.id === msg.author.id, { max: 1 })
      }

      meAt.leave()
    } else await msg.channel.send(locale('play_force_fail', meAt.name))
  }

  const guildConfig = ((await client.db.select('theme').where('guild', msg.guild.id).from('channels'))[0] || { theme: 1 })
  const [theme] = await client.db.select('*').from('themes').where('id', guildConfig.theme)
  client.lavalink.play(userAt, theme.url)

  const data = await getYtInfo(theme.url)

  if (hasPermissions(client.user?.id!, msg.channel as GuildChannel, ['EMBED_LINKS'])) {
    const embed = new DefaultEmbed(query.cmd, msg.guild?.me?.roles.color, {
      title: data.title,
      description: locale('play_detail', data.author.name, data.url)
    }).setImage(data.image)
      .setFooter(locale('play_detail_footer', client.config.prefix))

    msg.channel.send(embed)
  } else msg.channel.send(locale('play_success'))
}

export const aliases = ['play', 'join', '재생', '시작']
