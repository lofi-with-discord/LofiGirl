import { GuildChannel, Message } from 'discord.js'
import Client from '../classes/Client'
import Query from '../classes/Query'
import { Locale } from '../types'
import { DefaultEmbed, hasPermissions } from '../utils'

export default function (client: Client, msg: Message, query: Query, locale: Locale) {
  const channel = msg.channel as GuildChannel

  const perm = hasPermissions(client.user?.id!, channel, ['EMBED_LINKS'])
  if (perm) {
    const embed = new DefaultEmbed(query.cmd, msg.guild?.me?.roles.color, {
      title: locale('invite_title'),
      url: `https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=0&scope=bot`,
      description: locale('invite_description', 'https://discord.gg/WJRtvankkB')
    })

    msg.channel.send(embed)
    return
  }

  msg.channel.send(`${locale('invite_title')}\nhttps://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=0&scope=bot\n\n${locale('invite_description', 'https://discord.gg/WJRtvankkB')}`)
}

export const aliases = ['invite', 'support', '초대', '초대링크']
