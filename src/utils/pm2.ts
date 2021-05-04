import io from '@pm2/io'
import { VoiceChannel } from 'discord.js'
import Client from '../classes/Client'

export function registPm2 (client: Client) {
  io.metric({
    name: 'Active Users',
    unit: 'users',
    id: 'active_users',
    value: () =>
      client.channels.cache
        .filter((c) => c instanceof VoiceChannel && c.members.has(client.user?.id!))
        .reduce((prev, curr) =>
          prev + (curr as VoiceChannel).members.filter((m) => !m.user.bot).size, 0)
  })

  io.metric({
    name: 'Active Channels',
    unit: 'channels',
    id: 'active_channels',
    value: () =>
      client.channels.cache
        .filter((c) => c instanceof VoiceChannel && c.members.has(client.user?.id!))
        .size
  })
}
