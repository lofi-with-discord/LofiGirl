import { LavalinkNodeOptions, Manager } from '@lavacord/discord.js'
import { Guild, VoiceChannel } from 'discord.js'
import { get } from 'superagent'
import Client from './Client'
import Logger from './Logger'

export default class Lavalink extends Manager {
  private logger: Logger
  private trackCache: { [key: string]: string } = {}

  constructor (client: Client, opt: LavalinkNodeOptions[], logger: Logger) {
    super(client, opt)
    this.logger = logger
  }

  async play (channel: VoiceChannel, url: string) {
    if (!channel) return
    console.log(channel)

    await this.leave(channel.guild.id)
    const player = await this.join({ guild: channel.guild.id, channel: channel.id, node: 'main' })

    player.on('error', (err) => this.logger.logError(err.type, err.error))
    player.on('warn', (warn) => this.logger.logWarn(warn))

    this.logger.logInfo(false, channel.guild)
    await player.play(await this.getTrack(url))
  }

  async stop (guild: Guild) {
    if (guild.voice) this.logger.logInfo(true, guild)
    await this.leave(guild.id)
  }

  async getTrack (url: string) {
    if (!this.trackCache[url]) {
      const params = new URLSearchParams()
      params.append('identifier', url)

      const node = this.nodes.get('main')
      if (!node) process.exit(1)

      const res =
        await get('http://' + node.host + ':' + node.port + '/loadtracks?' + params)
          .set('Authorization', node.password)

      this.trackCache[url] = res.body.tracks[0].track
    }

    return this.trackCache[url]
  }
}
