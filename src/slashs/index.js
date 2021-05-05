const { existsSync } = require('fs')
const path = require('path')
const { readRecursively } = require('../utils')

const PATH = path.resolve()

/** @param {import('../classes/Client').default} client */
function _ (client) {
  const commandPath = PATH + '/dist/slashs/commands'
  const isCommandExists = existsSync(commandPath)

  const commands = []

  if (isCommandExists) {
    const files = readRecursively(commandPath)

    for (const file of files) {
      if (!file.endsWith('.js')) continue

      commands.push(require(file))
    }
  }

  for (const cmd of commands) {
    const application = client.api.applications(client.user.id)

    if (!client.config.dev) application.commands.post(cmd.meta)
    else application.guilds('811259754641883156').commands.post(cmd.meta)
  }

  client.ws.on('INTERACTION_CREATE', async (interaction) => {
    const cmd = commands.find((cmd) => cmd._ === interaction.data.name)
    if (!cmd) return

    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: await cmd.default(client, interaction)
      }
    })
  })
}

exports.default = _
