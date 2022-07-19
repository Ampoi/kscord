module.exports = function(client, ENV, commands){
  client.once('ready', async () => {
    console.log("start setup cmd 2");
    await client.application.commands.set(commands, ENV.GUILD);
    console.log(`===[Logged in as ${client.user.tag}!]===`);
    console.log("    Successful setup commands");
  }); //コマンドの設定
}