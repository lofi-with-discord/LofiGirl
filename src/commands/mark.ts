import { Message } from 'discord.js'
import Client from '../classes/Client'

export default async function (client: Client, msg: Message) {
  if (!msg.guild) return
  if (!msg.member) return
  if (!msg.member.hasPermission('MANAGE_CHANNELS')) return msg.channel.send(`:rolling_eyes: 음... \`${msg.member.displayName}\`님은 채널을 설정할 권한이 없어요!\n이 명령어를 사용하려면 적어도 \`채널 관리\` 권한을 가지고 있어야 해요`)
  if (!msg.member.voice.channel) return msg.channel.send(':loudspeaker: 항상 재생을 설정할 음성 채널에 들어간후 다시 시도해 주세요')
  if (!msg.member.voice.channel.joinable) return msg.channel.send(':microphone2: 아앗.. 제가 그 음성 채널에 들어갈 수가 없어요ㅠㅠ')
  if (!msg.member.voice.channel.speakable) return msg.channel.send(':zipper_mouth: 전 그 음성 채널에서 말을 할 수 있는 권한이 없어요ㅠㅠ')

  const [hasAleady] = await client.db.select('theme').where('guild', msg.guild.id).from('channels')

  if (hasAleady) await client.db.update({ id: msg.member.voice.channel.id }).where('guild', msg.guild.id).from('channels')
  else await client.db.insert({ id: msg.member.voice.channel.id, guild: msg.guild.id }).into('channels')

  msg.channel.send(`:ok_hand: \`${msg.member.voice.channel.name}\`에서 틀어드리는걸로 설정했어요!\n*tip: \`${client.config.prefix}play\`로 바로 재생할 수 있어요\n*tip: \`${client.config.prefix}theme\`로 다른 음악 테마를 선택할 수 있어요`)

  if (!msg.guild.me?.voice?.channel) {
    const [theme] = await client.db.select('*').from('themes').where('id', 1)
    await client.lavalink.play(msg.member.voice.channel, theme.url)
  }
}

export const aliases = ['mark', 'select', 'target', '채널', '채널설정', '항상재생']
export const descript = '항상 Lo-Fi를 틀어드릴 채널을 설정할 수 있어요'
