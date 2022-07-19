//環境変数
require("dotenv").config()
const ENV = process.env

//discord関連
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//データ取得(ひらがなAPI)
const axios = require("axios");
const APIKEY = ENV.GOO_APIKEY;
const BASE_URL = `https://labs.goo.ne.jp/api/hiragana`;

//データベース
const dbEngine = require("nedb")
const kadaiDB = new dbEngine({
  filename: "./database/kadai.db",
  autoload: true
});
kadaiDB.loadDatabase();

//自分系
let myname = ""
async function me(){
  const promised = await client.users.fetch("737569378639544331")
  myname = promised.username
}
me()

//関数系
const functions_get = require("./functions/functions.js")
const functions = functions_get(
  MessageEmbed,
  client,
  kadaiDB
);

//コマンドデータ
const fs = require("fs")
const path = require("path")
const command_folder = "./commands/"
let commands = []
let command_functions = {}
const files = fs.readdirSync(command_folder)
  .filter((file) => {
      return path.extname(file).toLowerCase() === ".js";
  })
for(const file of files){
  const command_file_setup = require(`${command_folder}${file}`)
  const command_file = command_file_setup()
  commands.push(command_file.data)
  command_functions[command_file.data.name] = command_file.command
}
console.log(command_functions);

//コマンドセットアップ
const commandSetUp = require("./functions/cmd_setup.js")
commandSetUp(client, ENV, commands);

//コマンドとか
client.on('interactionCreate', async interaction => { //メッセージを受け取ったら
  if (!interaction.isCommand()) return; //コマンド以外は無視

  const { commandName } = interaction;
  const channelID = interaction.channel.id;

  command_functions[commandName](
    interaction, {
      hiragana: {
        axios: axios,
        APIKEY: APIKEY,
        BASE_URL: BASE_URL
      },
      db: {
        kadaiDB: kadaiDB,
        engine: dbEngine
      },
      functions: functions
    }
  )
});

client.login(ENV.TOKEN);