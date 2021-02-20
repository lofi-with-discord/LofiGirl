import { GuildChannel, Message } from 'discord.js'
import Client from '../classes/Client'
import Query from '../classes/Query'
import { DefaultEmbed, getYtInfo, hasPermissions } from '../utils'

export default async function (client: Client, msg: Message, query: Query) {
  if (!msg.guild) return
  if (!msg.member) return
  if (!msg.member.voice.channel) return msg.channel.send(':loudspeaker: 재생할 음성 채널에 들어간후 다시 시도해 주세요')
  if (!msg.member.voice.channel.joinable) return msg.channel.send(':microphone2: 아앗.. 제가 그 음성 채널에 들어갈 수가 없어요ㅠㅠ')
  if (!msg.member.voice.channel.speakable) return msg.channel.send(':zipper_mouth: 전 그 음성 채널에서 말을 할 수 있는 권한이 없어요ㅠㅠ')

  const userAt = msg.member.voice.channel
  const meAt = msg.guild.me?.voice?.channel

  if (meAt) {
    if (meAt.id === userAt.id) meAt.leave()
    else if (meAt.members.size > 1) meAt.leave()
    else if (hasPermissions(msg.author.id, meAt, ['MOVE_MEMBERS'])) {
      const m = await msg.channel.send(`:grey_question: \`${meAt.name}\`에서 이미 틀고 있어요! 이동할까요?`)

      if (hasPermissions(client.user?.id!, msg.channel as GuildChannel, ['ADD_REACTIONS'])) {
        m.react('✅')
        await m.awaitReactions((react, user) => react.emoji.name === '✅' && user.id === msg.author.id, { max: 1 })
      } else {
        msg.channel.send(`* \`${client.config.prefix}이동\`으로 이동합니다`)
        await msg.channel.awaitMessages((message, user) => message.content === `${client.config.prefix}이동` && user.id === msg.author.id, { max: 1 })
      }

      meAt.leave()
    } else await msg.channel.send(`:octagonal_sign: \`${meAt.name}\`에서 이미 틀고 있어요!`)
  }

  const guildConfig = ((await client.db.select('theme').where('guild', msg.guild.id).from('channels'))[0] || { theme: 1 })
  const [theme] = await client.db.select('*').from('themes').where('id', guildConfig.theme)
  client.lavalink.play(userAt, theme.url)

  const data = await getYtInfo(theme.url)

  if (hasPermissions(client.user?.id!, msg.channel as GuildChannel, ['EMBED_LINKS'])) {
    const embed = new DefaultEmbed(query.cmd, msg.guild?.me?.roles.color, {
      title: data.title,
      description: `\`${data.author.name}\`님의 스트림 - [YouTube 링크](${data.url})`
    }).setImage(data.image)
      .setFooter(`*tip: ${client.config.prefix}theme 로 테마 변경`)

    msg.channel.send(embed)
  } else msg.channel.send(':tada: 틀었어요~')
}

export const aliases = ['play', 'join', '재생', '시작']
export const descript = '정해진 테마의 Lo-Fi 스트림을 재생해줘요'
