module.exports = function(){
  return {
    data:{
      name: "bot",
      description: "どういうことBOT「どういうこと」",
      options: [
        {
          type: 3,
          name: "moji",
          required: true,
          description: "BOT風にする文字を入力"
        }
      ]
    },
    command(interaction){
      const moji = interaction.options.getString("moji")
      interaction.reply(`${moji}bot「${moji}」`)
    }
  }
}