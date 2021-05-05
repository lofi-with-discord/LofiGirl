import Client from '../../classes/Client'
import { DefaultEmbed } from '../../utils'
import os from 'os'
import { VoiceChannel } from 'discord.js'

export default async function (client: Client) {
  const inline = true
  const freemem = Math.round(os.freemem() / 1024 / 1024)
  const totalmem = Math.round(os.totalmem() / 1024 / 1024)
  const usedmem = totalmem - freemem
  const activeChannels = client.channels.cache.filter((c) => c instanceof VoiceChannel && c.members.has(client.user?.id!))
  const registedChannes = await client.db.select('*').from('channels')

  const embed = new DefaultEmbed('상태', null, {
    fields: [
      { name: 'Bot Uptime', value: (client.uptime! / 1000) + 'sec', inline },
      { name: 'System Uptime', value: os.uptime + 'sec', inline },
      { name: 'Mem (Used/Total)', value: `${usedmem}MB/${totalmem}MB (${Math.round(usedmem / totalmem * 1000) / 10}%)`, inline },
      { name: 'Active Users', value: activeChannels.reduce((prev, curr) => prev + (curr as VoiceChannel).members.filter((m) => !m.user.bot).size, 0) + ' users', inline },
      { name: 'Active Channels', value: activeChannels.size + ' channels', inline },
      { name: 'Total Guilds', value: client.guilds.cache.size + ' guilds', inline },
      { name: 'Total Channels', value: client.channels.cache.filter((c) => c instanceof VoiceChannel).size + ' channels', inline },
      { name: 'Registed Channels', value: registedChannes.length + ' channels', inline }
    ]
  })

  return {
    embeds: [
      embed.toJSON()
    ]
  }
}

export const _ = '상태'
export const meta = {
  data: {
    name: '상태',
    description: '현재 LofiGirl봇의 상태를 보여줘요'
  }
}
