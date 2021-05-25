import { GuildChannel, Message } from 'discord.js'
import { hasPermissions } from '../utils'
import Client from '../classes/Client'
import Query from '../classes/Query'
import { Locale } from '../types'

export default async function (client: Client, msg: Message, _: Query, locale: Locale) {
  if (!msg.guild) return
  if (!msg.member) return

  const meAt = msg.guild.me?.voice?.channel
  const userAt = msg.guild.me?.voice?.channel

  if (!meAt) return msg.channel.send(locale('leave_no_voice'))

  if (!meAt || meAt !== userAt) {
    const membersIn = meAt.members.filter((m) => !m.user.bot).size
    if (membersIn < 1) {
      client.lavalink.leave(msg.guild.id)
      msg.channel.send(locale('leave_success'))
    } else if (hasPermissions(msg.author.id, meAt, ['MOVE_MEMBERS'])) {
      const m = await msg.channel.send(locale('leave_fource_question_1', meAt.name))

      if (hasPermissions(client.user?.id!, msg.channel as GuildChannel, ['ADD_REACTIONS'])) {
        m.react('✅')
        await m.awaitReactions((react, user) => react.emoji.name === '✅' && user.id === msg.author.id, { max: 1 })
      } else {
        msg.channel.send(locale('leave_force_no_react', client.config.prefix))
        await msg.channel.awaitMessages((message, user) => message.content === locale('leave_force_no_react_answer', client.config.prefix) && user.id === msg.author.id, { max: 1 })

        client.lavalink.leave(msg.guild.id)
      }
    } else msg.channel.send(locale('leave_force_fail_1', meAt.name))
  } else {
    const membersIn = meAt.members.filter((m) => !m.user.bot && m.id !== msg.author.id).size
    if (membersIn < 1) {
      client.lavalink.leave(msg.guild.id)
      msg.channel.send(locale('leave_success'))
    } else if (hasPermissions(msg.author.id, meAt, ['MOVE_MEMBERS'])) {
      const m = await msg.channel.send(locale('leave_force_question_2', meAt.name))

      if (hasPermissions(client.user?.id!, msg.channel as GuildChannel, ['ADD_REACTIONS'])) {
        m.react('✅')
        await m.awaitReactions((react, user) => react.emoji.name === '✅' && user.id === msg.author.id, { max: 1 })
      } else {
        msg.channel.send(locale('leave_force_no_react', client.config.prefix))
        await msg.channel.awaitMessages((message, user) => message.content === locale('leave_force_no_react_answer', client.config.prefix) && user.id === msg.author.id, { max: 1 })

        client.lavalink.leave(msg.guild.id)
      }
    } else msg.channel.send(locale('leave_force_fail_2', meAt.name))
  }
}

export const aliases = ['leave', 'stop', '정지', '나가기']
