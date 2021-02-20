import { VoiceChannel } from 'discord.js'
import Client from '../classes/Client'

interface Activity {
  name: string,
  type: 'LISTENING' | 'PLAYING' | 'STREAMING' | 'WATCHING' | 'CUSTOM_STATUS' | 'COMPETING'
}

const ACTIVITIES: Activity[] = [
  { name: '{{prefix}}help | Lo-fi', type: 'LISTENING' },
  { name: '{{many}}명과 함깨 Lo-fi를', type: 'LISTENING' },
  { name: '{{guilds}}개의 서버와 함깨', type: 'LISTENING' },
  { name: '{{prefix}}theme로 테마를 바꿔보세요!', type: 'PLAYING' },
  { name: '테마 추가 신청은 깃허브에서 (https://github.com/lofi-with-discord/LofiGirl/discussions/1)', type: 'PLAYING' },
  { name: 'koreanbots에 한번이라도 로그인 하신분은 하트를 눌러야 작동해요', type: 'PLAYING' }
]

export default function runActivityCycle (client: Client) {
  let c = 0

  setInterval(() => {
    if (c >= ACTIVITIES.length) c = 0
    const activity = ACTIVITIES[c]
    c++

    client.user?.setActivity(
      activity.name
        .replace('{{prefix}}', client.config.prefix)
        .replace('{{many}}', String(client.channels.cache.filter((c) => c instanceof VoiceChannel && c.members.has(client.user?.id!)).reduce((prev, curr) => prev + (curr as VoiceChannel).members.filter((m) => !m.user.bot).size, 0)))
        .replace('{{guilds}}', String(client.guilds.cache.size))
      , { type: activity.type }
    )
  }, 10000)
}
