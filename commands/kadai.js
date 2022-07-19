module.exports = function(){
  return {
    data:{
      name: "kadai",
      description: "課題の確認・追加とかができます",
      options: [
        {
          type: 3,
            name: "type",
            required: true,
            description: "サブコマンド",
            choices: [
              {name:"課題を表示", value:"show"},
              {name:"課題を達成", value:"done"},
              {name:"課題の達成を解除", value:"cancel"},
              {name:"課題をターゲットに指定", value:"aim"},
              {name:"課題を追加", value:"add"},
              {name:"課題のサブタイトルを設定", value:"description"},
              {name:"ヘルプ", value:"help"},
              {name:"課題を削除", value:"delete"},
              {name:"課題を全消し", value:"clear"},
            ]
        },
        {
            type: 3,
            name: "option",
            description: "addは追加する課題名、doneは達成した課題番号、deleteは削除する課題番号",
            required: false
        }
      ]
    },
    command(interaction, library){
      const type = interaction.options.getString("type")
      const option = interaction.options.getString("option")
      const sendUser = interaction.member

      const kadaiDB = library.db.kadaiDB
      const dbEngine = library.db.dbEngine
      const functions = library.functions

      switch (type) {
        case "add":
          if(option != null){
            new Promise((resolve, reject) => {
              kadaiDB.find({},(err, docs) => {
                if (docs.length == 0){
                  resolve(1)
                }else{
                  kadaiDB.findOne({}).sort({number: -1}).exec((err, doc) => {
                    resolve(doc.number + 1)
                  })
                }
              })
            }).then((number) => {
              const name = functions.kakko(option).kakkogai
              const description = functions.kakko(option).kakkonai
              const newDoc = {
                number: number,
                name : name,
                doneMember: [],
                AimingMember: [],
                description: description
              }
              kadaiDB.insert(newDoc)
              interaction.reply(`課題「${option}」を追加しました！`)
            })
          }else{
            interaction.reply({content:"optionを指定してください！", ephemeral: true})
          }
          break;
        case "done":
          kadaiDB.findOne({number: parseInt(option)}, (error, doc) => {
            let newDM = doc
            const doneMembers = newDM.doneMember
            const aimingMembers = newDM.AimingMember
            if (newDM != null) {//課題番号の課題があるとき
              if (doneMembers.includes(sendUser.id)){
                interaction.reply({content: "すでに課題は達成済みです", ephemeral:true})
              }else{
                newDM.doneMember.push(sendUser.id)
                if(aimingMembers.includes(sendUser.id)){ 
                  const deleteSTR = sendUser.id
                  newDM.AimingMember = aimingMembers.filter((a)=>{
                    return a !== deleteSTR
                  })
                }
                kadaiDB.update({number: parseInt(option)}, newDM)
                interaction.reply({content: "課題を達成としてマークしました！お疲れ様です！", ephemeral:true})
                .then(() => {
                  functions.getKadai(sendUser).then(result => {
                    interaction.followUp({embeds: result, ephemeral: true})
                  })
                })
              }
            }else{
              interaction.reply(`たぶん入力したひとその課題ないよ 入力した数字は「${option}」`)
            }
          })
          break;
        case "aim":
          kadaiDB.findOne({number: parseInt(option)}, (error, doc) => {
            let newDM = doc
            if (newDM != null) {
              //課題番号の課題があるとき
              const doneMember = newDM.doneMember
              const aimingMember = newDM.AimingMember
              if (aimingMember.includes(sendUser.id)){
                //課題番号の課題を照準してるとき
                interaction.reply({content: "すでに課題は照準済みです", ephemeral:true})
              }else{
                //課題番号の課題を照準していないとき
                if (doneMember.includes(sendUser.id)){
                  //課題番号の課題を達成してるとき
                  interaction.reply({content: "すでに課題は達成済みです", ephemeral: true})
                }else{
                  //課題番号の課題を達成していないとき
                  newDM.AimingMember.push(sendUser.id) //ここはnewDMの上書きだからaimingMemberを使用するな
                  kadaiDB.update({number: parseInt(option)}, newDM)
                  interaction.reply({content: "課題に照準を合わせました！頑張ってください！", ephemeral:true})
                  .then(() => {
                    functions.getKadai(sendUser).then(result => {
                      interaction.followUp({embeds: result, ephemeral: true})
                    })
                  })
                }
              }
            }else{
              interaction.reply(`たぶん入力したひとその課題ないよ 入力した数字は「${option}」`)
            }
          })
          break;
        case "description":
          const number = functions.kakko(option).kakkogai
          const newOpt = functions.kakko(option).kakkonai

          kadaiDB.findOne({number: parseInt(number)}, (error, doc) => {
            let newDM = doc
            if (newDM != null) {//課題番号の課題があるとき
              newDM.description = newOpt
              kadaiDB.update({number: parseInt(number)}, newDM)
              interaction.reply({content: "課題のサブタイトルを変更しました!", ephemeral:true})
              .then(() => {
                functions.getKadai(sendUser).then(result => {
                  interaction.followUp({embeds: result, ephemeral: true})
                })
              })
            }else{
              interaction.reply(`たぶん入力したひとその課題ないよ 入力した数字は「${option}」`)
            }
          })
          break;
        case "cancel":
          kadaiDB.findOne({number: parseInt(option)}, (error, doc) => {
            let newDM = doc
            const doneMembers = newDM.doneMember
            if (newDM != null) {//課題番号の課題があるとき
              if (doneMembers.includes(sendUser.id)){
                const deleteSTR = sendUser.id
                newDM.doneMember = doneMembers.filter((a)=>{
                  return a !== deleteSTR
                })
                kadaiDB.update({number: parseInt(option)}, newDM)
                interaction.reply({content: "課題を達成から解除しました！頑張ってください！", ephemeral:true})
              }else{
                interaction.reply({content: "課題は達成としてマークされてません", ephemeral:true})
              }
            }else{
              interaction.reply(`たぶん入力したひとその課題ないよ 入力した数字は「${option}」`)
            }
          })
          break;
        case "show":
          functions.getKadai(sendUser).then(result => {
            interaction.reply({embeds: result, ephemeral: false})
          })
          break;
        case "delete":
          const getDeleteKadai = new Promise ((resolve, reject) => {
            kadaiDB.findOne({number: parseInt(option)}, (error, doc) => {
              resolve(doc.name)
            })
          })
          kadaiDB.remove({number: parseInt(option)}, (error, doc) => {
            getDeleteKadai.then((name) => {
              interaction.reply(`課題「${name}」を削除しました！`)
            })
          })
          break;
        case "clear":
          new Promise ((resolve) =>{
            kadaiDB.remove({}, {multi: true})
            resolve();
          }).then(() => {
            interaction.reply("課題を全消ししました")
          })
          break;
        case "help":
          interaction.reply({embeds: [{
            title: "KScord課題管理ヘルプ",
            color: 0x379c6f,
            author: {
              name: "Ampoi"
            },
            description: "KScordの各コマンドについての解説",
            fields: [
              {
                name: "課題を追加",
                value: "```/kadai type:<課題を追加を選択> options:課題名(サブタイトル)```で課題を追加できます"
              },
              {
                name: "課題のサブタイトルを指定",
                value: "```/kadai type:<課題のサブタイトルを指定を選択> option:(リスト番号)サブタイトル```で課題のサブタイトルを指定できます"
              },
              {
                name: "課題を達成",
                value: "```/kadai type:<課題を達成を選択> options:<達成した課題のリスト番号(半角数字)>```で課題を達成とマークできます"
              },
              {
                name: "課題を表示",
                value: "```/kadai type:<課題を表示を選択>```で課題一覧を表示します"
              },
              {
                name: "課題をターゲットに指定",
                value: "typeで課題をターゲットに指定を選択して 課題を達成 と同じ感じでコマンドを打てばできます"
              },
              {
                name: "課題を削除",
                value: "typeで課題を削除を選択して 課題を達成 と同じようにコマンドを打てばできます(基本的には使わないで下さい)"
              },
              {
                name: "課題を全消し",
                value: "**絶対使うな**"
              }
            ]
          }], ephemeral: true})
          break;
        default:
          interaction.reply("多分そんなコマンドないよ")
          break;
      }
    }
  }
}
