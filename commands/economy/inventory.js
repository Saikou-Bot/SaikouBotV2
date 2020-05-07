const UserData = require("../../models/userData.js")
const { MessageEmbed } = require('discord.js')

module.exports = {
    config: {
        name: 'inventory',
        description: 'Shows a users inventory.',
        usage: '.inventory',
        accessableby: 'Public',
        aliases: ['inv']
    },
    run: async (bot, message, args) => {


        UserData.findOne({
            userID: message.author.id,
        }, (err, userData) => {
            if (err) console.log(err)

            if (!userData) {
                const newData = new UserData({
                    username: message.author.username,
                    userID: message.author.id,
                    coins: 0,
                    items: [{ itemName: 'Free Rations', itemID: 'FreeRations', itemQuantity: 1, itemSell: 0, itemEmoji: '<:rations:707207234848817163>', itemType: 'Freebie' }]
                })
                newData.save().catch(err => console.log(err))

                const FreeRationsInv = new MessageEmbed()
                    .setTitle(`${message.author.username}'s inventory`)
                    .setDescription(`All your owned items are stored here! Check them out and maybe use one or two with \`.use itemName\``)
                    .addField(`Your items:`, `<:rations:707207234848817163> **x 1** **∙** \`Free Rations\` **-** Freebie\nSells for: S$0\n\n`)
                    .setColor(message.member.displayHexColor)

                return message.channel.send(FreeRationsInv)

            } else {


                var invdesc = "";

                let embed = new MessageEmbed()
                    .setTitle(`${message.author.username}'s inventory`)
                    .setDescription(`All your owned items are stored here! Check them out and maybe use one or two with \`.use itemName\`\n\n`)
                    .setColor(message.member.displayHexColor)


                userData.items.forEach(a => {
                    invdesc += `${a.itemEmoji} **x ${a.itemQuantity}** **∙** \`${a.itemName}\` **-** ${a.itemType}\nSells for: S$${a.itemSell.toLocaleString()}\n\n`;
                })

                embed.addField(`Your items:`, invdesc)

                message.channel.send(embed)



            }

        })







    }
}