import { Message } from 'discord.js'

import Query from '../classes/Query'
import Client from '../classes/Client'

export interface Config {
  prefix: string
  token: string
  [key: string]: string
}

export interface Command {
  default: (client: Client, msg: Message, query: Query) => any,
  aliases: string[]
}
