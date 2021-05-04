import { VoiceState } from 'discord.js'
import Client from '../classes/Client'

export default async function onVoiceStateUpdate (client: Client, oldState: VoiceState, newState: VoiceState) {
  if (oldState.member?.id === client.user?.id) return
  if (newState.member?.id === client.user?.id) return

  // 나갔을때
  if (!newState.channelID) {
    console.log('Leaving: ' + oldState.channelID)
    const members = oldState.channel?.members!
    const isHere = members.find((member) => member.id === client.user?.id)
    const many = members.filter((member) => !member.user.bot).size

    if (!isHere) return
    if (many > 0) return

    client.lavalink.leave(oldState.guild.id)

    return
  }

  // 들어왔을때
  if (!oldState.channelID) {
    console.log('Joining: ' + newState.channelID)
    const members = newState.channel?.members!
    const isHere = members.find((member) => member.id === client.user?.id)
    const [isMarked] = await client.db.select('*').where({ id: newState.channelID }).from('channels')

    if (isHere) return
    if (!isMarked) return

    const { theme = 1 } = ((await client.db.select('theme').where({ guild: newState.guild.id }).from('channels'))[0] || {})
    const [themeData] = await client.db.select('*').from('themes').where({ id: theme })
    client.lavalink.play(newState.channel!, themeData.url)

    return
  }

  // 이동했을때
  if (oldState.channelID !== newState.channelID) {
    console.log('Moving: ' + oldState.channelID + ' -> ' + newState.channelID)
    const members = oldState.channel?.members!
    const isHere = members.find((member) => member.id === client.user?.id)
    const many = members.filter((member) => !member.user.bot).size

    if (many < 1 && isHere) client.lavalink.leave(oldState.guild.id)

    const members2 = newState.channel?.members!
    const isHere2 = members2.find((member) => member.id === client.user?.id)
    const [isMarked2] = await client.db.select('*').where({ id: newState.channelID }).from('channels')

    if (isHere2) return
    if (!isMarked2) return

    const { theme = 1 } = ((await client.db.select('theme').where({ guild: newState.guild.id }).from('channels'))[0] || {})
    const [themeData] = await client.db.select('*').from('themes').where({ id: theme })
    client.lavalink.play(newState.channel!, themeData.url)
  }
}
