import { GuildChannel, Message } from 'discord.js'
import { hasPermissions } from '../utils'
import Client from '../classes/Client'
import Query from '../classes/Query'

export default async function (client: Client, msg: Message, query: Query) {
  if (!msg.guild) return
  if (!msg.member) return

  const meAt = msg.guild.me?.voice?.channel
  const userAt = msg.guild.me?.voice?.channel

  if (!meAt) return msg.channel.send(':thinking: 이미 아무 채널에도 들어가있지 않아요!')

  if (!meAt || meAt !== userAt) {
    const membersIn = meAt.members.filter((m) => !m.user.bot).size
    if (membersIn < 1) {
      client.lavalink.leave(msg.guild.id)
      msg.channel.send(':hand_splayed: 스트림을 멈추고 나왔어요~')
    } else if (hasPermissions(msg.author.id, meAt, ['MOVE_MEMBERS'])) {
      const m = await msg.channel.send(`:grey_question: \`${meAt.name}\`에서 이미 틀고 있어요! 그래도 나올까요?`)

      if (hasPermissions(client.user?.id!, msg.channel as GuildChannel, ['ADD_REACTIONS'])) {
        m.react('✅')
        await m.awaitReactions((react, user) => react.emoji.name === '✅' && user.id === msg.author.id, { max: 1 })
      } else {
        msg.channel.send(`* \`${client.config.prefix}그래도나오기\`로 나옵니다`)
        await msg.channel.awaitMessages((message, user) => message.content === `${client.config.prefix}그래도나오기` && user.id === msg.author.id, { max: 1 })

        client.lavalink.leave(msg.guild.id)
      }
    } else msg.channel.send(`:octagonal_sign: \`${meAt.name}\`에 듣고있는 사람이 있어 나갈 수 없어요`)
  } else {
    const membersIn = meAt.members.filter((m) => !m.user.bot && m.id !== msg.author.id).size
    if (membersIn < 1) {
      client.lavalink.leave(msg.guild.id)
      msg.channel.send(':hand_splayed: 스트림을 멈추고 나왔어요~')
    } else if (hasPermissions(msg.author.id, meAt, ['MOVE_MEMBERS'])) {
      const m = await msg.channel.send(`:grey_question: \`${meAt.name}\`에서 다른사람도 Lofi를 듣고있어요. 그래도 나올까요?`)

      if (hasPermissions(client.user?.id!, msg.channel as GuildChannel, ['ADD_REACTIONS'])) {
        m.react('✅')
        await m.awaitReactions((react, user) => react.emoji.name === '✅' && user.id === msg.author.id, { max: 1 })
      } else {
        msg.channel.send(`* \`${client.config.prefix}그래도나오기\`로 나옵니다`)
        await msg.channel.awaitMessages((message, user) => message.content === `${client.config.prefix}그래도나오기` && user.id === msg.author.id, { max: 1 })

        client.lavalink.leave(msg.guild.id)
      }
    } else msg.channel.send(`:octagonal_sign: \`${meAt.name}\`에 다른사람도 듣고있어 나갈 수 없어요`)
  }
}

export const aliases = ['leave', 'stop', '정지', '나가기']
export const descript = '재생중인 스트림을 멈추고 음성 채널에서 나가줘요'
