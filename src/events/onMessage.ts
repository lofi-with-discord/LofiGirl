import { GuildChannel, Message } from 'discord.js'
import { get } from 'superagent'
import Client from '../classes/Client'
import { DefaultEmbed, hasPermissions } from '../utils'
import Query from './../classes/Query'

const cache: string[] = []

/**
 * @param {import('../classes/Client')} client
 * @param {import('discord.js').Message} msg
 */
export default async function onMessage (client: Client, msg: Message) {
  const { prefix } = client.config
  const { author, content } = msg

  if (author.bot) return
  if (!client.user) return

  if (!msg.guild) {
    author.send(':thinking: DM으로는 음악을 틀 수 없어요ㅠㅠ\n하지만 대답없는 말동무가 되줄순 있답니다 \\:)')
      .catch()
  }

  const channel = msg.channel as GuildChannel
  if (!channel.permissionsFor(client.user.id)?.has('SEND_MESSAGES')) return

  if (msg.mentions.has(client.user)) {
    const m = await msg.channel.send('누구야! 누가 맨션해써!')
    setTimeout(() => {
      m.edit(`:call_me: 부르셨나요? 아, 도움이 필요하신가요?\n\`${prefix}help\`로 도움말을 확인해 보세요!`)
    }, 500)
    return
  }

  if (!content.startsWith(prefix)) return

  const query = new Query(prefix, content)
  const target = client.commands.find((command) => command.aliases.includes(query.cmd))

  if (!target) return

  if (client.config.koreanbots?.enable) {
    if (!cache.includes(msg.author.id)) {
      const { status, body } =
        await get(client.config.koreanbots.baseURL + '/bots/voted/' + msg.author.id)
          .set('token', client.config.koreanbots.token)
          .catch(() => { return { status: 400, body: {} } })

      if (status !== 200) target.default(client, msg, query)
      else if (body.voted) {
        cache.push(msg.author.id)
        target.default(client, msg, query)
      } else {
        if (hasPermissions(client.user.id, channel, ['EMBED_LINKS'])) {
          const embed = new DefaultEmbed('welcome', null, {
            title: 'Lofi Girl이 멈추지 않도록 :heart:를 눌러 주세요',
            description: '클릭 한번으로 1인 개발자에게 큰 희망을 줄 수 있어요\n' +
              '(Koreanbots에 한번이라도 로그인 한 적이 있는 경우 :heart:를 눌러야지만 명령어 기능을 사용할 수 있습니다)\n\n' +
              ':heart: 주러 가기](' + client.config.koreanbots.profileURL + ' "여기를 눌러 Koreanbots로 이동합니다") •' +
              '[:star: 주러 가기](https://github.com/lofi-with-discord/LofiGirl "여기를 눌러 Github로 이동합니다")'
          })
          msg.channel.send(embed)
        } else {
          msg.channel.send(
            '헤잉.. 죄송하지만 하트 버튼 하나만 딱 눌러주시면 안될까요...\n' +
            '(하트를 누르면 명령어 기능을 사용하실 수 있습니다)\n' +
            client.config.koreanbots.profileURL)
        }
      }
    } else target.default(client, msg, query)
  } else target.default(client, msg, query)
}
