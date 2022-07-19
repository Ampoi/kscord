module.exports = function(
  MessageEmbed,
  client,
  kadaiDB
){
  return {
    //課題リストの作成
    getKadai(sendUser){
      return new Promise((resolve, reject) => {
        let List = []
        kadaiDB.find({}).sort({number: 1}).exec((error, docs) => {
          for (const doc of docs) {
            let check = ""
            const doneMember = doc.doneMember
            const aimingMember = doc.AimingMember
            if(doneMember.includes(sendUser.id)){
              check = "✅"
            }else{
              if(aimingMember.includes(sendUser.id)){
                check = "🔥"
              }else{
                check = "❌"
              }
            }
            let newDes = ""
            if(doc.description != ""){newDes = doc.description
            }else{newDes = "(サブタイトルは指定されていません)"}
            List.push({
              name: `(${doc.number}) | ${check} | ${doc.name}`,
              value: newDes
            })
          }
          const embed = new MessageEmbed()
            .setAuthor({
              iconURL: `https://cdn.discordapp.com/avatars/${sendUser.user.id}/${sendUser.user.avatar}`,
              name: sendUser.displayName
            })
            .setColor("#058ffa")
            .setTitle(`${sendUser.displayName}の課題`)
            .setFields(List)
            .setFooter({
                iconURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}`,
                text: `©️${client.user.username} | made by Ampoi`
            })
          return resolve([embed])
        })
      })
    },
    //かっこの判断
    kakko(option){
      const moji = option.match(/\((.+)\)/)
      let kakkonai = ""
      if (moji != null){
        kakkonai = moji[1]
      }
      const kakkogai = option.replace(`(${kakkonai})`,"") //かっこ以外
      return {
        kakkonai: kakkonai,
        kakkogai: kakkogai
      }
    }
  }
}