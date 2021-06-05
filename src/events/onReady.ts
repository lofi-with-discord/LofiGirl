import { VoiceChannel } from 'discord.js'
import { post } from 'superagent'
import Client from '../classes/Client'

export default async function (client: Client) {
  if (client.user) console.log(client.user.username + ' is now online!')
  if (client.config) console.log('ㄴPrefix: ' + client.config.prefix)

  setInterval(() => {
    client.user?.setActivity(`${client.config.prefix}help | with ${client.channels.cache.filter((c) => c instanceof VoiceChannel && c.members.has(client.user?.id!)).reduce((prev, curr) => prev + (curr as VoiceChannel).members.filter((m) => !m.user.bot).size, 0)} users`)
  }, 5000)

  await client.lavalink.connect().catch(() => process.exit(1))
  console.log('Lavalink Connected')

  const channels = await client.db.select('*').from('channels')
  for (const channel of channels) {
    const rawChannel = client.channels.resolve(channel.id)
    if (!rawChannel) continue

    const voiceChannel = rawChannel as VoiceChannel
    const membersIn = voiceChannel.members.filter((m) => !m.user.bot).size

    if (membersIn < 1) {
      await client.lavalink.stop(voiceChannel.guild)
      continue
    }

    const [theme] = await client.db.select('*').from('themes').where({ id: channel.theme })
    client.lavalink.play(voiceChannel, theme.url)
  }

  for (const rawChannel of client.channels.cache.filter((c) => c instanceof VoiceChannel && c.members.has(client.user?.id!)).array()) {
    const voiceChannel = rawChannel as VoiceChannel

    const membersIn = voiceChannel.members.filter((m) => !m.user.bot).size
    if (membersIn < 1) {
      await client.lavalink.stop(voiceChannel.guild)
      continue
    }

    const { theme = 1 } = ((await client.db.select('theme').where({ guild: voiceChannel.guild.id }).from('channels'))[0] || {})
    const [themeData] = await client.db.select('*').from('themes').where({ id: theme })

    if (!client.lavalink.players.get(voiceChannel.guild.id)?.playing) {
      client.lavalink.play(voiceChannel, themeData.url)
    }
  }

  if (client.config.koreanbots?.enable) {
    setInterval(async () => {
      await post(client.config.koreanbots.baseURL + '/stats')
        .set('Authorization', client.config.koreanbots.token)
        .send({ servers: client.guilds.cache.size })
        .catch(console.log)
    }, 300000)
  }

  require('../slashs/index').default(client)
}
