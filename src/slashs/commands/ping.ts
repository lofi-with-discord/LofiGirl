import Client from '../../classes/Client'

export default async function (client: Client) {
  return { content: `:ping_pong: 지연시간: **${client.ws.ping}밀리초**` }
}

export const _ = '핑'
export const meta = {
  data: {
    name: '핑',
    description: '통신 지연 속도를 측정하고 보여줘요'
  }
}
