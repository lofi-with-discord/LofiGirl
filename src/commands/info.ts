import { GuildChannel, Message, VoiceChannel } from 'discord.js'
import Client from '../classes/Client'
import Query from '../classes/Query'
import { DefaultEmbed, hasPermissions } from '../utils'
import os from 'os'

export default async function (client: Client, msg: Message, query: Query) {
  const channel = msg.channel as GuildChannel
  const perm = hasPermissions(client.user?.id!, channel, ['EMBED_LINKS'])

  const inline = true
  const freemem = Math.round(os.freemem() / 1024 / 1024)
  const totalmem = Math.round(os.totalmem() / 1024 / 1024)
  const usedmem = totalmem - freemem
  const activeChannels = client.channels.cache.filter((c) => c instanceof VoiceChannel && c.members.has(client.user?.id!))
  const registedChannes = await client.db.select('*').from('channels')

  const embed = new DefaultEmbed(query.cmd, msg.guild?.me?.roles.color, {
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

  const str =
    `**Bot Uptime**\n\`${(client.uptime! / 1000)}sec\`\n\n` +
    `**System Uptime**\n\`${os.uptime}sec\`\n\n` +
    `**Mem (Used/Total)**\n\`${usedmem}MB/${totalmem}MB (${Math.round(usedmem / totalmem * 1000) / 10}%)\`\n\n` +
    `**Active Users**\n\`${activeChannels.reduce((prev, curr) => prev + (curr as VoiceChannel).members.filter((m) => !m.user.bot).size, 0)} users\`\n\n` +
    `**Active Channels**\n\`${activeChannels.size} channels\`\n\n` +
    `**Total Guilds**\n\`${client.guilds.cache.size} guilds\`\n\n` +
    `**Total Channels**\n\`${client.channels.cache.filter((c) => c instanceof VoiceChannel).size} channels\`\n\n` +
    `**Registed Channels**\n\`${registedChannes.length} channels\`\n\n`

  msg.channel.send(perm ? embed : str)
}

export const aliases = ['info', '상태', '정보']
