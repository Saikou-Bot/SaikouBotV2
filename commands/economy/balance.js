const { MessageEmbed } = require('discord.js')
const mongoose = require("mongoose")

mongoose.connect(process.env.MONGOPASSWORD, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const CoinsData = require("../../models/coinsData.js")


module.exports = {
    config: {
        name: 'balance',
        description: 'Displays the users balance.',
        usage: '?bal',
        accessableby: 'Public',
        aliases: ['bal', 'b', 'money', 'coins', 'cash']
    },
    run: async (bot, message, args) => {

        var user = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.username === `${args.join(" ").slice('.')}`) || message.author;

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



        CoinsData.findOne({
            userID: user.id
        }, (err, coinsData) => {
            if (err) console.log(err)

            if (!coinsData) {
                const newData = new CoinsData({
                    username: user.username,
                    userID: user.id,
                    coins: 0,
                })
                newData.save().catch(err => console.log(err))

                let BalanceEmbed1 = new MessageEmbed()
                    .setTitle(`💰${user.username || user.displayName}'s balance`)
                    .addField(`Base`, `0`)
                    .setFooter(`Status: Very Poor`)
                    .setTimestamp()


                return message.channel.send(BalanceEmbed1)

            } else {


                if (coinsData.coins > 0 && coinsData.coins < 1000) { var status = new String(); status += `${statuses[0]}` } // Very Poor
                else if (coinsData.coins > 999 && coinsData.coins < 10000) { var status = new String(); status += `${statuses[1]}` } // Broke
                else if (coinsData.coins > 9999 && coinsData.coins < 50000) { var status = new String(); status += `${statuses[2]}` } // Sustainable
                else if (coinsData.coins > 49999 && coinsData.coins < 150000) { var status = new String(); status += `${statuses[3]}` } // Wealthy
                else if (coinsData.coins > 149999 && coinsData.coins < 500000) { var status = new String(); status += `${statuses[4]}` } // Very Wealthy
                else if (coinsData.coins > 499999 && coinsData.coins < 1000000) { var status = new String(); status += `${statuses[5]}` } // Rich
                else if (coinsData.coins > 999999 && coinsData.coins < 1999999999) { var status = new String(); status += `${statuses[6]}` } // Filthy Rich
                else { var status = new String(); status += `${statuses[0]}` }

                let BalanceEmbed2 = new MessageEmbed()
                    .setTitle(`💰${user.username || user.displayName}'s balance`)
                    .addField(`Base`, coinsData.coins.toLocaleString())
                    .setColor(message.member.displayHexColor)
                    .setFooter(`Status: ${status}`)
                    .setTimestamp()


                return message.channel.send(BalanceEmbed2)
            }
        })
    }


}


