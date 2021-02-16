import Client from '../classes/Client'

export default function (client: Client) {
  if (client.user) console.log(client.user.username + ' is now online!')
  if (client.config) console.log('ㄴPrefix: ' + client.config.prefix)
}
