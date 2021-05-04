import { VoiceState } from 'discord.js'
import Client from '../classes/Client'

export default async function onVoiceStateUpdate (client: Client, old: VoiceState, state: VoiceState) {
  const channels = await client.db.select('*').from('channels')

  if (!state.channelID) console.log('나감')
  else if (!old.channelID) console.log('들어옴')
  else if (old.channelID !== state.channelID) console.log('이동함')

  for (const channel of channels) {
    if (old.channelID === channel.id && state.channelID !== channel.id) {
      if (!old.channel) return

      if (old.channel.members.filter((member) => !member.user.bot).size < 1) {
        client.lavalink.stop(old.guild)
        continue
      }
    }

    if (old.channelID !== channel.id && state.channelID === channel.id) {
      if (!state.channel) return

      const { theme = 1 } = ((await client.db.select('theme').where({ guild: state.guild.id }).from('channels'))[0] || {})
      const [themeData] = await client.db.select('*').from('themes').where({ id: theme })
      client.lavalink.play(state.channel, themeData.url)
    }
  }

  if (!old?.channel?.members) return
  if (old.channel.members.filter((member) => !member.user.bot).size < 1) {
    client.lavalink.stop(old.guild)
  }
}
