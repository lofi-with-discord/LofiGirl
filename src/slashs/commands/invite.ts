import Client from '../../classes/Client'
import { DefaultEmbed } from '../../utils'

export default async function (client: Client) {
  const embed = new DefaultEmbed('초대', null, {
    title: ':tada: 여길 눌러 LofiGirl을 초대해 보세요 :tada:',
    url: `https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=0&scope=bot`,
    description: '[지원 서버](https://discord.gg/WJRtvankkB)도 있어요'
  })

  return {
    embeds: [
      embed.toJSON()
    ]
  }
}

export const _ = '초대'
export const meta = {
  data: {
    name: '초대',
    description: '봇 초대 링크와 지원 서버 링크를 보여줘요'
  }
}
