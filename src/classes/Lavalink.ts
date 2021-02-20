import { Manager } from '@lavacord/discord.js'
import { VoiceChannel } from 'discord.js'
import { get } from 'superagent'

export default class Lavalink extends Manager {
  private trackCache: { [key: string]: string } = {}

  async play (channel: VoiceChannel, url: string) {
    const player = await this.join({ guild: channel.guild.id, channel: channel.id, node: 'main' })
    if (!this.players.get(channel.guild.id)?.playing) {
      await player.play(await this.getTrack(url)).catch(process.exit)
    }
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
