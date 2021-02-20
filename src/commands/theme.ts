import { GuildChannel, Message } from 'discord.js'
import Client from '../classes/Client'
import Query from '../classes/Query'
import { DefaultEmbed, getYtInfo, hasPermissions } from '../utils'

const SECOND = 1000
const NUMBER_EMOJIS = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':ten:']
const NUMBER_UNICODES = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

export default async function (client: Client, msg: Message, query: Query) {
  if (!msg.guild) return

  const perm = hasPermissions(client.user?.id!, msg.channel as GuildChannel, ['EMBED_LINKS', 'ADD_REACTIONS'])
  const themes = await client.db.select('*').from('themes')

  if (perm) {
    const embed = new DefaultEmbed(query.cmd, msg.guild?.me?.roles.color, {
      title: `:cd: ${themes.length}개의 테마를 찾았어요`,
      description: '[추가요청](https://github.com/lofi-with-discord/LofiGirl/discussions/1)'
    })

    const m = await msg.channel.send(':floppy_disk: 테마 목록을 불러오는중...')

    for (const index in themes) {
      if (!themes[index]) return

      embed.addField(`${NUMBER_EMOJIS[index]} ${themes[index].name}`, themes[index].url)
      m.react(NUMBER_UNICODES[index])
    }

    m.edit('', embed)
    const reactions = await m.awaitReactions((react, user) => NUMBER_UNICODES.includes(react.emoji.name) && user.id === msg.author.id, { max: 1, time: 60 * SECOND })
    const reaction = reactions.first()

    m.reactions.removeAll().catch(() => {})

    if (!reaction) {
      m.edit(':hourglass_flowing_sand: 앗, 선택시간이 지났어요', { embed: null })
      return
    }

    const chosen = NUMBER_UNICODES.indexOf(reaction.emoji.name)
    if (!themes[chosen]) {
      m.edit(`:thinking: ${NUMBER_EMOJIS[chosen]}은 맞는 테마가 아니에요`, { embed: null })
      return
    }

    m.edit(`:ok_hand: 테마를 \`${themes[chosen].name}\`으로 설정했어요`, { embed: null })
    await client.db.update({ theme: themes[chosen].id }).where({ guild: msg.guild.id }).from('channels')
  } else {
    let str = `:cd: ${themes.length}개의 테마를 찾았어요\n`

    const m = await msg.channel.send(':floppy_disk: 테마 목록을 불러오는중...')

    for (const index in themes) {
      if (!themes[index]) return
      str += `\n${NUMBER_EMOJIS[index]} ${themes[index].name}\n${themes[index].url}\n`
    }

    str += `\n\`${client.config.prefix}set <테마번호>\`로 테마를 변경합니다`
    m.edit(str)

    const messages = await msg.channel.awaitMessages((message) => message.author.id === msg.author.id && message.content.startsWith(`${client.config.prefix}set `), { max: 1, time: 60 * SECOND })
    const message = messages.first()

    if (!message) {
      m.edit(':hourglass_flowing_sand: 앗, 선택시간이 지났어요', { embed: null })
      return
    }

    const messageQuery = new Query(client.config.prefix, message.content)

    const chosen = parseInt(messageQuery.args[0] || '1') - 1
    if (!themes[chosen]) {
      m.edit(`:thinking: ${NUMBER_EMOJIS[chosen]}은 맞는 테마가 아니에요`, { embed: null })
      return
    }

    m.edit(`:ok_hand: 테마를 \`${themes[chosen].name}\`으로 설정했어요`, { embed: null })
    await client.db.update({ theme: themes[chosen].id }).where({ guild: msg.guild.id }).from('channels')
  }

  const userAt = msg.member?.voice.channel
  const meAt = msg.guild.me?.voice?.channel
  if (meAt) {
    if (meAt === userAt) {
      meAt.leave()

      const guildConfig = ((await client.db.select('theme').where('guild', msg.guild.id).from('channels'))[0] || { theme: 1 })
      const [theme] = await client.db.select('*').from('themes').where('id', guildConfig.theme)
      client.lavalink.play(meAt, theme.url)

      const data = await getYtInfo(theme.url)

      if (hasPermissions(client.user?.id!, msg.channel as GuildChannel, ['EMBED_LINKS'])) {
        const embed = new DefaultEmbed(query.cmd, msg.guild?.me?.roles.color, {
          title: data.title,
          description: `\`${data.author.name}\`님의 스트림 - [YouTube 링크](${data.url})`
        }).setImage(data.image)
          .setFooter(`*tip: ${client.config.prefix}theme 로 테마 변경`)

        msg.channel.send(embed)
      } else msg.channel.send(':tada: 틀었어요~')
    } else {
      if (hasPermissions(msg.author.id, meAt, ['MOVE_MEMBERS'])) {
        const m = await msg.channel.send(`:grey_question: \`${meAt.name}\`에서 이미 틀고 있어요, 틀고있는 테마를 지금 바꿀까요?\n*아닐경우 모든 청자가 음성채널을 나갔을때 테마를 변경합니다`)

        if (hasPermissions(client.user?.id!, msg.channel as GuildChannel, ['ADD_REACTIONS'])) {
          m.react('✅')
          await m.awaitReactions((react, user) => react.emoji.name === '✅' && user.id === msg.author.id, { max: 1 })
        } else {
          msg.channel.send(`* \`${client.config.prefix}바꾸기\`로 테마를 지금 바꿉니다`)
          await msg.channel.awaitMessages((message, user) => message.content === `${client.config.prefix}바꾸기` && user.id === msg.author.id, { max: 1 })
        }

        meAt.leave()

        const guildConfig = ((await client.db.select('theme').where('guild', msg.guild.id).from('channels'))[0] || { theme: 1 })
        const [theme] = await client.db.select('*').from('themes').where('id', guildConfig.theme)
        client.lavalink.play(meAt, theme.url)

        const data = await getYtInfo(theme.url)

        if (hasPermissions(client.user?.id!, msg.channel as GuildChannel, ['EMBED_LINKS'])) {
          const embed = new DefaultEmbed(query.cmd, msg.guild?.me?.roles.color, {
            title: data.title,
            description: `\`${data.author.name}\`님의 스트림 - [YouTube 링크](${data.url})`
          }).setImage(data.image)
            .setFooter(`*tip: ${client.config.prefix}theme 로 테마 변경`)

          msg.channel.send(embed)
        } else msg.channel.send(':tada: 틀었어요~')
      } else msg.channel.send(`:grey_exclamation: \`${meAt.name}\`에서 이미 틀고 있어요, 모든 청자가 음성채널을 나갔을때 테마를 변경할깨요`)
    }
  }
}

export const aliases = ['theme', '테마', '테마설정']
export const descript = '틀어드릴 Lo-Fi 테마를 바꿀 수 있어요'
