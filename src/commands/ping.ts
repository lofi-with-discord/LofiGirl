import { Message } from 'discord.js'
import Client from '../classes/Client'

export default function (client: Client, msg: Message) {
  msg.channel.send(`:ping_pong: 지연시간: **${client.ws.ping}밀리초**`)
}

export const aliases = ['ping', '핑', 'pong']
export const descript = '통신 지연 속도를 측정하고 보여줘요'
