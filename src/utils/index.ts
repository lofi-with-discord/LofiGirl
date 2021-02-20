import { GuildChannel, MessageEmbed, MessageEmbedOptions, PermissionString, Role } from 'discord.js'
import { readdirSync, statSync } from 'fs'
import yts from 'yt-search'

// from https://gist.github.com/kethinov/6658166
export function readRecursively (dirPath: string, fileList: string[] = []) {
  const files = readdirSync(dirPath)
  for (const file of files) {
    const filePath = dirPath + '/' + file
    const stat = statSync(filePath)

    if (stat.isFile()) fileList.push(filePath)
    else fileList = readRecursively(filePath, fileList)
  }

  return fileList
}

export function hasPermissions (userId: string, channel: GuildChannel, permissions: PermissionString[]) {
  const channelPerms = channel.permissionsFor(userId)

  if (!channelPerms) return false

  for (const permission of permissions) {
    if (!channelPerms.has(permission)) {
      return false
    }
  }

  return true
}

export class DefaultEmbed extends MessageEmbed {
  constructor (situation?: string, roleForColoring?: Role | null, options?: MessageEmbed | MessageEmbedOptions) {
    super(options)
    this.color = roleForColoring?.color || 0xdf73ff
    this.setAuthor(`${situation ? `Lofi Girl - ${situation}` : 'Lofi Girl'}`, 'https://cdn.discordapp.com/avatars/763033945767280650/f28f0969527e600a8a2c16fae84f8ce3.webp')
    this.setThumbnail('https://media.discordapp.net/attachments/708927519973441556/763208406047129631/994BB93F5AD305BF02.png')
  }
}

export async function getYtInfo (urlstr: string) {
  const url = new URL(urlstr)
  return await yts({ videoId: url.searchParams.get('v')! })
}
