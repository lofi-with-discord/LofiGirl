<p align="center">
  <img src="https://i.ytimg.com/vi/5qap5aO4i9A/maxresdefault.jpg" />
  <small>
    * Illustration by <a href="https://bit.ly/Machadofb">Juan Pablo Machado</a>
  </small>
</p>

<h1 align="center">
  Lofi Girl
</h1>

<p align="center">
  Discord bot that just playing youtube live streams
</p>

<br />
<br />

## installation guide
### Prerequirements
* `node` (v12.x~)
* `npm` or `yarn`
* `mysql` or `mariadb`
* `java` (**v13.x only**)

### Windows
1. run `npm i` or `yarn` to get dependancies
1. if your jdk version is not `v13`, get it from [here](https://jdk.java.net/archive/)
2. get lavalink jar file from [here](https://github.com/freyacodes/Lavalink/releases/download/3.3.2.5/Lavalink.jar)
3. place `C:\path\to\download\folder\Lavalink.jar` to `C:\path\to\this\code\folder\lavalink/lavalink.jar`
4. run `java -jar lavalink/lavalink.jar` to start lavalink server
5. open mysql shell and run `source database.sql`
6. copy default configuration from `config.inc.json` to `config.json`
7. edit your `config.json` file
8. run `npm i` or `yarn` to get dependancies
9. open another terminal and run `yarn start`

### Linux
1. run `npm i` or `yarn` to get dependancies
1. if your jdk version is not `v13`, get it from [here](https://jdk.java.net/archive/)
2. run `./install.sh` to get lavalink.jar file
3. run `java -jar lavalink/lavalink.jar` to start lavalink server
4. type `sudo mysql` to open mysql shell and run `source database.sql`
5. copy default configuration from `config.inc.json` to `config.json`
6. edit your `config.json` file
7. run `npm i` or `yarn` to get dependancies
8. open another terminal and run `yarn start`
