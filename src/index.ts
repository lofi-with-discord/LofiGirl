import Client from './classes/Client'
import onReady from './events/onReady'
import onMessage from './events/onMessage'

const client = new Client()

client.start()
client.regist('ready', onReady)
client.regist('message', onMessage)
