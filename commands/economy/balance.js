const { MessageEmbed } = require('discord.js')
const coinsData = require("../../models/userData.js")


module.exports = {
    config: {
        name: 'balance',
        description: 'Displays the users balance.',
        usage: '?bal',
        accessableby: 'Public',
        aliases: ['bal', 'b', 'money', 'coins', 'cash']
    },
    run: async (bot, message, args) => {

        var user = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.username === `${args.join(" ").slice('.').toLowerCase()}`) || message.author;

        if (!user) user = message.author;
        if (user.bot) user = message.author;

        const statuses = [
            'Very Poor',
            'Broke',
            'Sustainable',
            'Wealthy',
            'Very Wealthy',
            'Rich',
            'Filthy Rich'
        ]



        coinsData.findOne({
            userID: user.id
        }, (err, UserData) => {
            if (err) console.log(err)

            if (!UserData) {
                const newData = new coinsData({
                    username: user.username,
                    userID: user.id,
                    lb: "all",
                    coins: 0,
                    items: [{ itemName: 'Free Rations', itemID: 'FreeRations', itemQuantity: 1, itemSell: 0, itemEmoji: '<:rations:707207234848817163>', itemType: 'Freebie' }]
                })
                newData.save().catch(err => console.log(err))

                let BalanceEmbed1 = new MessageEmbed()
                    .setTitle(`💰${user.username || user.displayName}'s balance`)
                    .addField(`Base`, `0`)
                    .setColor(message.member.displayHexColor)
                    .setFooter(`Status: Very Poor`)
                    .setTimestamp()


                return message.channel.send(BalanceEmbed1)

            } else {


                if (UserData.coins > 0 && UserData.coins < 1000) { var status = new String(); status += `${statuses[0]}` } // Very Poor
                else if (UserData.coins > 999 && UserData.coins < 10000) { var status = new String(); status += `${statuses[1]}` } // Broke
                else if (UserData.coins > 9999 && UserData.coins < 50000) { var status = new String(); status += `${statuses[2]}` } // Sustainable
                else if (UserData.coins > 49999 && UserData.coins < 150000) { var status = new String(); status += `${statuses[3]}` } // Wealthy
                else if (UserData.coins > 149999 && UserData.coins < 500000) { var status = new String(); status += `${statuses[4]}` } // Very Wealthy
                else if (UserData.coins > 499999 && UserData.coins < 1000000) { var status = new String(); status += `${statuses[5]}` } // Rich
                else if (UserData.coins > 999999 && UserData.coins < 1999999999) { var status = new String(); status += `${statuses[6]}` } // Filthy Rich
                else { var status = new String(); status += `${statuses[0]}` }

                let BalanceEmbed2 = new MessageEmbed()
                    .setTitle(`💰${user.username || user.displayName}'s balance`)
                    .addField(`Base`, UserData.coins.toLocaleString())
                    .setColor(message.member.displayHexColor)
                    .setFooter(`Status: ${status}`)
                    .setTimestamp()


                return message.channel.send(BalanceEmbed2)
            }
        })
    }


}


