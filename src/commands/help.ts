import { GuildChannel, Message } from 'discord.js'
import Client from '../classes/Client'
import Query from '../classes/Query'
import { Locale } from '../types'
import { DefaultEmbed, hasPermissions } from '../utils'

export default async function (client: Client, msg: Message, query: Query, locale: Locale) {
  const channel = msg.channel as GuildChannel

  const perm = hasPermissions(client.user?.id!, channel, ['EMBED_LINKS', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])

  if (perm) {
    const embed = new DefaultEmbed('', msg.guild?.me?.roles.color, {
      description: ':radio: 24/7 radio player for discord\n- developed by `Dev. PMH#7086`'
    }).setImage('https://i.ytimg.com/vi/5qap5aO4i9A/maxresdefault.jpg')
      .setFooter('* illustration by Juan Pablo Machado (http://jpmachado.art)')

    const m = await msg.channel.send(locale('help_continue'), embed)

    m.react('🚩')

    await m.awaitReactions((react, user) => react.emoji.name === '🚩' && user.id === msg.author.id, { max: 1 })
    m.reactions.removeAll().catch(() => {})

    const fields = []
    for (const command of client.commands) {
      const { aliases } = command

      if (!aliases) continue

      const name = aliases.reduce((acc, alias) => `${acc}\`${client.config.prefix}${alias}\` `, '')
      fields.push({ name, value: locale(`${aliases[0]}_help`) })
    }

    const embed2 = new DefaultEmbed(query.cmd, msg.guild?.me?.roles.color)
      .addFields(fields)
      .setImage('https://cdn.discordapp.com/attachments/530043751901429762/812601825568096287/Peek_2021-02-20_17-29.gif')

    m.edit('', embed2)
    return
  }

  let str = ''
  for (const command of client.commands) {
    const { aliases } = command

    if (!aliases) continue

    const name = aliases.reduce((acc, alias) => `${acc}\`${client.config.prefix}${alias}\` `, '')
    str += `${name}\n${locale(`${aliases[0]}_help`)}\n\n`
  }

  msg.channel.send(str)
}

export const aliases = ['help', '도움', '도움말', '명령어']
