import Client from '../../classes/Client'
import { DefaultEmbed } from '../../utils'

export default async function (client: Client) {
  const fields = []
  for (const command of client.commands) {
    console.log(fields)
    const { aliases } = command

    if (!aliases) continue

    const name = aliases.reduce((acc, alias) => `${acc}\`${client.config.prefix}${alias}\` `, '')
    fields.push({ name, value: client.locale.__(`${aliases[0]}_help`) })
  }

  return {
    embeds: [
      new DefaultEmbed('도움말')
        .setImage('https://cdn.discordapp.com/attachments/530043751901429762/812601825568096287/Peek_2021-02-20_17-29.gif')
        .addFields(fields)
        .toJSON()
    ]
  }
}

export const _ = '도움말'
export const meta = {
  data: {
    name: '도움말',
    description: '도움말을 보여줘요'
  }
}
