import { Message } from 'discord.js'
import Client from '../classes/Client'
import Query from '../classes/Query'
import { Locale } from '../types'

export default function (client: Client, msg: Message, _: Query, locale: Locale) {
  msg.channel.send(locale('ping_success', client.ws.ping))
}

export const aliases = ['ping', '핑', 'pong']
export const descript = '통신 지연 속도를 측정하고 보여줘요'
