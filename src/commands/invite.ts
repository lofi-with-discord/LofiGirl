import { GuildChannel, Message } from 'discord.js'
import Client from '../classes/Client'
import Query from '../classes/Query'
import { DefaultEmbed, hasPermissions } from '../utils'

export default function (client: Client, msg: Message, query: Query) {
  const channel = msg.channel as GuildChannel

  const perm = hasPermissions(client.user?.id!, channel, ['EMBED_LINKS'])
  if (perm) {
    const embed = new DefaultEmbed(query.cmd, msg.guild?.me?.roles.color, {
      title: ':tada: 여길 눌러 LofiGirl을 초대해 보세요 :tada:',
      url: `https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=0&scope=bot`,
      description: '[지원 서버](https://discord.gg/VbcGYnv)도 있어요'
    })

    msg.channel.send(embed)
    return
  }

  msg.channel.send(`:tada: 여러분의 서버에 LofiGirl을 초대해 보세요 :tada:\nhttps://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=0&scope=bot\n\n지원서버도 있어요: https://discord.gg/VbcGYnv`)
}

export const aliases = ['invite', 'support', '초대', '초대링크']
export const descript = '봇 초대 링크와 지원 서버 링크를 보여줘요'
