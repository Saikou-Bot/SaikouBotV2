const { MessageEmbed } = require('discord.js')
const UserData = require("../../models/userData.js")
const errors = require("../utils/errors")
const colours = require("../../colours.json")


module.exports = {
    config: {
        name: 'buy',
        description: 'Purchase an item in the shop.',
        usage: '?buy itemName',
        accessableby: 'Public',
        aliases: ['purchase']
    },
    run: async (bot, message, args) => {

        //     if (args[0]) return message.channel.send("You must specify something to buy.")

        let itemName = args[0].toLowerCase();
        let item = bot.shop.get(itemName)

        if (!item) {
            return message.channel.send("You can't buy an invalid item??")

        } else {

            UserData.findOne({
                userID: message.author.id,
            }, (err, userData) => {
                if (err) console.log(err)

                if (!userData) {
                    const newData = new UserData({
                        username: message.author.username,
                        userID: message.author.id,
                        coins: 0,
                    })
                    newData.save().catch(err => console.log(err))

                    return errors.noCoins(message, `${item.name}` || message, `${item.cost.toLocaleString()}`)

                } else {

                    if (userData.coins < item.cost) {
                        return errors.noCoins(message, `${item.name}` || message, `${item.cost.toLocaleString()}`)
                    }


                    UserData.updateOne({
                        userID: message.author.id,
                        $set: { modified_on: new Date() },
                        //  $inc: { "items.$.itemQuantity": quantity },
                        $push: {
                            items: {
                                'itemName': item.name,
                                'itemID': item.id,
                                'itemQuantity': + 1,
                                'itemSell': Math.floor(item.cost / 2)
                            }
                        }

                    }).catch(err => console.log(err))

                }
                userData.coins -= item.cost
                userData.save()

                const success = new MessageEmbed()
                    .setTitle(`✅ Success!`)
                    .setDescription(`You successfully bought **${item.name}** for \`S$${item.cost}\` from the Military Market!`)
                    .setFooter('Successful Purchase')
                    .setTimestamp()
                    .setColor(colours.green)

                message.channel.send(success).then(message => { message.delete({ timeout: 15000 }) })

            })
        }
    }
}