import { Message } from 'discord.js'
import Client from '../classes/Client'
import Query from '../classes/Query'

export interface Config {
  prefix: string
  token: string
  dev: boolean
  [key: string]: any
}

export type Locale = (phrase: string, ...args: any[]) => string

export interface Command {
  default: (client: Client, msg: Message, query: Query, locale: Locale) => any
  aliases: string[]
}

export interface User {
  id: string,
  locale: string
}
