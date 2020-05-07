const { MessageEmbed } = require('discord.js')
const UserData = require("../../models/userData.js")
const errors = require("../utils/errors")
const colours = require("../../colours.json")
const fs = require('fs')


module.exports = {
    config: {
        name: 'buy',
        description: 'Purchase an item in the shop.',
        usage: '?buy itemName',
        accessableby: 'Public',
        aliases: ['purchase']
    },
    run: async (bot, message, args) => {

        let items = JSON.parse(fs.readFileSync("items.json", "utf8"))

        let itemName = '';
        let itemCost = 0;
        let itemEmoji = '';
        let itemID = '';
        let itemType = '';

        for (var i in items) {
            if (args.join(" ").trim().toUpperCase() === items[i].name.toUpperCase()) {
                itemName = items[i].name;
                itemCost = items[i].cost;
                itemEmoji = items[i].emoji;
                itemID = items[i].id;
                itemType = items[i].type;
            }
        }



        if (!itemName.length) {
            return message.channel.send("You must specify something to buy!")
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
                        items: [{ itemName: 'Free Rations', itemID: 'FreeRations', itemQuantity: 1, itemSell: 0, itemEmoji: '<:rations:707207234848817163>', itemType: 'Freebie' }]
                    })
                    newData.save().catch(err => console.log(err))

                    return errors.noCoins(message, `${itemName}` || message, `${itemCost.toLocaleString()}`)

                } else {

                    if (userData.coins < itemCost) {
                        return errors.noCoins(message, `${itemName}` || message, `${itemCost.toLocaleString()}`)
                    }


                    UserData.updateOne(
                        { userID: message.author.id },
                        {
                            $push: {
                                items: {
                                    'itemName': itemName,
                                    'itemID': itemID,
                                    'itemQuantity': + 1,
                                    'itemSell': Math.floor(itemCost / 2),
                                    'itemEmoji': itemEmoji,
                                    'itemType': itemType
                                }
                            }

                        }).catch(err => console.log(err))

                }
                userData.coins -= itemCost
                userData.save()

                const success = new MessageEmbed()
                    .setTitle(`✅ Success!`)
                    .setDescription(`You successfully bought **${itemName}** for \`S$${itemCost}\` from the Military Market!`)
                    .setFooter('Successful Purchase')
                    .setTimestamp()
                    .setColor(colours.green)

                message.channel.send(success).then(message => { message.delete({ timeout: 15000 }) })

            })
        }
    }
}