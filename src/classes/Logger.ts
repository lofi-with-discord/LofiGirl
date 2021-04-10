import { Guild, MessageEmbed, WebhookClient } from 'discord.js'

export default class Logger extends WebhookClient {
  private ERROR_COLOR = 0xff0000;
  private WARNING_COLOR = 0xffff00;

  constructor ({ id, token }: { id: string, token: string }) {
    super(id, token)
  }

  logError (type = 'Unknown', msg = '<blank>') {
    const embed = new MessageEmbed({
      color: this.ERROR_COLOR,
      title: type,
      description: msg
    }).setTimestamp()

    this.send(embed)
  }

  logWarn (msg = '<blank>') {
    const embed = new MessageEmbed({
      color: this.WARNING_COLOR,
      title: 'Warning',
      description: msg
    }).setTimestamp()

    this.send(embed)
  }

  logInfo (isLeave = false, gid: Guild) {
    const embed = new MessageEmbed({
      color: isLeave ? 0x0000ff : 0x00ffff,
      title: isLeave ? 'Leaving' : 'Playing',
      description: `${gid.name} (${gid.id})`
    }).setTimestamp()

    this.send(embed)
  }
}
