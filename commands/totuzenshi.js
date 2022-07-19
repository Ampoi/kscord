module.exports = function(){
  return {
    data: {
      name: "totuzenshi",
      description: "突然の死じぇねれーたー",
      options: [
	{
          type: 3,
          name: "moji",
          description: "突然の死にする文字を入力ー",
          required: true
        },
	{
	  type: 3,
	  name: "hide",
	  required: false,
	  description: "隠す？"
	}
      ]
    },
    async command(interaction){
      let moto = interaction.options.getString("moji")
      const hide_interaction = interaction.options.getString("hide")
      
      let hide = false
      if(hide_interaction == "true"){
        hide = true
      }
      let nagasa = 0
      let moji = "＿"
      for (let i = 0; i < moto.length; i++) {
        (moto[i].match(/[ -~]/)) ? nagasa += 0.5 : nagasa += 1;
      }
      nagasa = parseInt(nagasa)
    
      for (let i = 0; i < nagasa; i++) {moji += "人"}
      moji += "＿\n＞"
      moji += moto
      moji += "＜\n￣"
      for (let i = 0; i < nagasa; i++) {moji += "Ｙ"}
      moji += "￣"
    
      await interaction.reply({content: moji, ephemeral: hide});
    }
  }
}
