import { Client, MessageEmbed, TextChannel, WebhookClient } from 'discord.js'
import { existsSync, readFileSync } from 'fs'
import Knex from 'knex'
import path from 'path'
import { Command, Config } from '../types'
import { readRecursively } from '../utils'
import Lavalink from './Lavalink'

const PATH = path.resolve()

export default class extends Client {
  public db: Knex
  public config: Config
  public lavalink: Lavalink
  public commands: Command[] = []

  private logChannel?: TextChannel

  constructor () {
    super()

    const configPath = PATH + '/config.json'
    const commandPath = PATH + '/dist/commands'

    const isConfigExists = existsSync(configPath)
    const isCommandExists = existsSync(commandPath)

    if (isConfigExists) {
      const configRaw = readFileSync(configPath).toString('utf-8')
      const config = JSON.parse(configRaw)

      this.config = {
        token: config.token || process.env.TOKEN || '',
        prefix: config.prefix || process.env.PREFIX || '!',
        koreanbots: config.koreanbots || { enable: false }
      }
    } else {
      this.config = {
        token: process.env.TOKEN || '',
        prefix: process.env.PREFIX || '!',
        koreanbots: { enable: false }
      }
    }

    if (this.config.token.length < 1) throw new Error('TOKEN not provided')
    if (isCommandExists) {
      const files = readRecursively(commandPath)
      for (const file of files) {
        if (!file.endsWith('.js')) continue
        this.commands.push(require(file) as Command)
      }
    }

    this.db = Knex({
      client: 'mysql',
      connection: {
        host: 'localhost',
        port: 3306,
        user: 'lofigirl',
        database: 'lofigirl'
      }
    })

    const hook = new WebhookClient(this.config.webhook.id, this.config.webhook.token)
    const logger = (msg: MessageEmbed) => hook.send(msg)

    this.lavalink = new Lavalink(this, [{
      id: 'main',
      host: 'localhost',
      port: 2334,
      password: 'youshallnotpass'
    }], logger)

    this.on('ready', async () => {
      this.logChannel = await this.channels.resolve(this.config.servelog) as TextChannel
    })
  }

  public log = (content: string) => this.logChannel?.send(`${new Date()}\n${content}`)
  public start = (token?: string) => this.login(token || this.config.token)
  public regist = (event = 'ready', exec: any) =>
    this.on(event, (...args) => exec(this, ...args))
}
