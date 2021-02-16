import { Message } from 'discord.js'
import Client from '../classes/Client'

export default function (client: Client, msg: Message) {
  msg.channel.send('pong! (' + client.ws.ping + 'ms)')
}

export const aliases = ['ping', '핑', 'pong']
