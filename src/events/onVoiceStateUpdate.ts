import { VoiceChannel, VoiceState } from 'discord.js'
import Client from '../classes/Client'

export default async function onVoiceStateUpdate (client: Client, oldState: VoiceState, newState: VoiceState) {
  if (oldState.member?.user.bot) return
  if (newState.member?.user.bot) return

  const channels = await client.db.select('*').from('channels')

  for (const channel of channels) {
    const rawChannel = client.channels.resolve(channel.id)
    if (!rawChannel) continue

    const voiceChannel = rawChannel as VoiceChannel
    const joinMembers = voiceChannel.members.filter((m) => !m.user.bot).size

    if (joinMembers < 1) {
      client.lavalink.leave(voiceChannel.guild.id)
      continue
    }

    if (!client.lavalink.players.has(voiceChannel.guild.id)) {
      const [themeData] = await client.db.select('*').from('themes').where({ id: channel.theme })
      client.lavalink.play(voiceChannel, themeData.url)
    }
  }
}
