export default class {
  private content: string
  private splited: string[]

  public cmd: string
  public args: string[]

  constructor (prefix: string, raw: string) {
    this.content = raw.split(prefix)[1]
    this.splited = this.content.split(' ')

    this.cmd = this.splited[0]
    this.args = this.splited.splice(1)
  }
}
