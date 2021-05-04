import { VoiceChannel } from 'discord.js'
import Client from '../classes/Client'

interface Activity {
  name: string,
  type: 'LISTENING' | 'PLAYING' | 'STREAMING' | 'WATCHING' | 'CUSTOM_STATUS' | 'COMPETING'
}

const ACTIVITIES: Activity[] = [
  { name: '점검중입니다', type: 'PLAYING' }
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

    client.user?.setStatus('dnd')
  }, 10000)
}
