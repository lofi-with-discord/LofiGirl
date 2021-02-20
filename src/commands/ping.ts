import { Message } from 'discord.js'
import Client from '../classes/Client'

export default function (client: Client, msg: Message) {
  msg.channel.send(`:ping_pong: 지연시간: **${client.ws.ping}밀리초**`)
  setTimeout(() => {
    msg.channel.send('100mbps밖에 안나오는 가정집에서 힘들게 돌리고 있어요...\n쫌 끊기더라두 양해 부탁드려요! 후원문의: `Dev. PMH#7086`')
  }, 3000)
}

export const aliases = ['ping', '핑', 'pong']
export const descript = '통신 지연 속도를 측정하고 보여줘요'
