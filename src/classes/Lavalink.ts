import { LavalinkNodeOptions, Manager } from '@lavacord/discord.js'
import { Message, MessageEmbed, VoiceChannel } from 'discord.js'
import { get } from 'superagent'
import Client from './Client'

type Logger = (msg: MessageEmbed) => Promise<Message>

export default class Lavalink extends Manager {
  private logger: Logger
  private trackCache: { [key: string]: string } = {}

  constructor (client: Client, opt: LavalinkNodeOptions[], logger: Logger) {
    super(client, opt)
    this.logger = logger
  }

  async play (channel: VoiceChannel, url: string) {
    const player = await this.join({ guild: channel.guild.id, channel: channel.id, node: 'main' })

    player.on('error', (err) => this.logger(new MessageEmbed({ color: 0xff0000, title: err.type, description: err.error, footer: { text: err.reason } })))
    player.on('warn', (warn) => this.logger(new MessageEmbed({ color: 0xffff00, description: warn })))

    await player.play(await this.getTrack(url)).catch(process.exit)
  }

  async getTrack (url: string) {
    if (!this.trackCache[url]) {
      const params = new URLSearchParams()
      params.append('identifier', url)

      const node = this.nodes.get('main')
      if (!node) process.exit()

      const res =
        await get('http://' + node.host + ':' + node.port + '/loadtracks?' + params)
          .set('Authorization', node.password)

      this.trackCache[url] = res.body.tracks[0].track
    }

    return this.trackCache[url]
  }
}
