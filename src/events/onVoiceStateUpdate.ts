import { VoiceChannel, VoiceState } from 'discord.js'
import Client from '../classes/Client'

export default async function onVoiceStateUpdate (client: Client, oldState: VoiceState, newState: VoiceState) {
  if (oldState.member?.user.bot || newState.member?.user.bot) return

  const channels = await client.db.select('*').from('channels')
  for (const channel of channels) {
    const rawChannel = client.channels.resolve(channel.id)
    if (!rawChannel) continue

    const voiceChannel = rawChannel as VoiceChannel
    const membersIn = voiceChannel.members.filter((m) => !m.user.bot).size

    if (membersIn < 1) {
      await client.lavalink.leave(voiceChannel.guild.id)
      continue
    }

    const [theme] = await client.db.select('*').from('themes').where({ id: channel.theme })

    if (!client.lavalink.players.get(voiceChannel.guild.id)?.playing) {
      client.lavalink.play(voiceChannel, theme.url)
    }
  }

  for (const rawChannel of client.channels.cache.filter((c) => c instanceof VoiceChannel && c.members.has(client.user?.id!)).array()) {
    const voiceChannel = rawChannel as VoiceChannel

    const membersIn = voiceChannel.members.filter((m) => !m.user.bot).size
    if (membersIn < 1) {
      await client.lavalink.leave(voiceChannel.guild.id)
      continue
    }

    const { theme = 0 } = ((await client.db.select('theme').where({ guild: voiceChannel.guild.id }).from('channels'))[0] || {})
    const [themeData] = await client.db.select('*').from('themes').where({ id: theme })
    if (!client.lavalink.players.get(voiceChannel.guild.id)?.playing) {
      client.lavalink.play(voiceChannel, themeData.url)
    }
  }
}
