const { MessageEmbed } = require('discord.js')

const mongoose = require("mongoose")

const UserData = require("../../models/userData.js")


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
                userID: message.author.id
            }, (err, userData) => {
                if (err) console.log(err)

                if (!userData) {
                    const newData = new UserData({
                        username: message.author.username,
                        userID: message.author.id,
                        coins: 0,
                        itemQuantity: 0,
                    })
                    newData.save().catch(err => console.log(err))
                    return message.reply("You don't have any money to buy with.")
                } else {

                    var quantity = `inv_${message.author.id}.${item.id}.quantity` || 0

                    UserData.updateOne({
                        userID: message.author.id,
                        $set: { modified_on: new Date() },
                        $push: {
                            items: {
                                'itemName': item.name,
                                'itemID': item.id,
                                'itemQuantity': quantity + 1,
                                'itemSell': Math.floor(item.cost / 2)


                            }
                        }
                    }

                    ).catch(err => console.log(err))

                }


            })

        }
    }
}