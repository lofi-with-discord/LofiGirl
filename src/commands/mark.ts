import { Message } from 'discord.js'
import Client from '../classes/Client'
import Query from '../classes/Query'
import { Locale } from '../types'

export default async function (client: Client, msg: Message, _: Query, locale: Locale) {
  if (!msg.guild) return
  if (!msg.member) return
  if (!msg.member.hasPermission('MANAGE_CHANNELS')) return msg.channel.send(locale('mark_no_permission', msg.member.displayName))
  if (!msg.member.voice.channel) return msg.channel.send(locale('mark_no_voice'))
  if (!msg.member.voice.channel.joinable) return msg.channel.send(locale('mark_not_joinable'))
  if (!msg.member.voice.channel.speakable) return msg.channel.send(locale('mark_not_speakable'))

  const [hasAleady] = await client.db.select('theme').where('guild', msg.guild.id).from('channels')

  if (hasAleady) await client.db.update({ id: msg.member.voice.channel.id }).where('guild', msg.guild.id).from('channels')
  else await client.db.insert({ id: msg.member.voice.channel.id, guild: msg.guild.id }).into('channels')

  msg.channel.send(locale('mark_success', msg.member.voice.channel.name, client.config.prefix))

  if (!msg.guild.me?.voice?.channel) {
    const [theme] = await client.db.select('*').from('themes').where('id', 1)
    await client.lavalink.play(msg.member.voice.channel, theme.url)
  }
}

export const aliases = ['mark', 'select', 'target', '채널', '채널설정', '항상재생']
