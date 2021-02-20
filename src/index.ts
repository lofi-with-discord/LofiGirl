import Client from './classes/Client'
import onMessage from './events/onMessage'
import onReady from './events/onReady'
import onVoiceStateUpdate from './events/onVoiceStateUpdate'

const client = new Client()

client.start()
client.regist('ready', onReady)
client.regist('message', onMessage)
client.regist('voiceStateUpdate', onVoiceStateUpdate)
