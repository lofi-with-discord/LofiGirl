import { Message } from 'discord.js'
import Client from '../classes/Client'
import Query from '../classes/Query'

export interface Config {
  prefix: string
  token: string
  [key: string]: any
}

export interface Command {
  default: (client: Client, msg: Message, query: Query) => any
  aliases: string[]
  descript: string
}

export interface User {
  id: string,
  locale: string
}
