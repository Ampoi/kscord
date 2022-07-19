module.exports = function(){
  return {
    data:{
      name: "hiragana",
      description: "ひ　ら　が　な　で　あ　お　れ　る　よ",
      options: [{
          type: 3,
          name: "moji",
          description: "あ　お　る　も　じ　を　に　ゅ　う　り　ょ　く",
          required: true
      }]
  },
    command(interaction, library){
      let MOTO = interaction.options.getString("moji")
      const OUTPU_TYPE = `hiragana`;

      library.hiragana.axios({
        method: 'post',
        url: library.hiragana.BASE_URL,
        headers: {
            'Content-Type': `application/x-www-form-urlencoded`,
            'Content-Type': `application/json`
        },
        data: {
            app_id: library.hiragana.APIKEY,
            sentence: MOTO,
            output_type: OUTPU_TYPE
        }
      })
      .then(async function(res){
        let hiragana = res.data.converted
        hiragana.replace(/\s/g, "")
        const array = hiragana.split("")
        let newMsg = ""
        for(const itimoji of array){
          newMsg += `${itimoji}　`
        }
        await interaction.reply(newMsg)
      })
      .catch((err) => {console.log(err);})
    }
  }
}