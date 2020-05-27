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
        let items = require('../../items/items.json')
        let items2 = require('../../items/items2.json')

        let Name = '';
        let itemCost = 0;
        let itemEmoji = '';
        let itemID = '';
        let itemType = '';

        for (var i in items) {
            if (args.join(" ").trim().toUpperCase() === items[i].name.toUpperCase()) {
                Name = items[i].name;
                itemCost = items[i].cost;
                itemEmoji = items[i].emoji;
                itemID = items[i].id;
                itemType = items[i].type;
            } else {
                for (var i in items2) {
                    if (args.join(" ").trim().toUpperCase() === items2[i].name.toUpperCase()) {
                        Name = items2[i].name;
                        itemCost = items2[i].cost;
                        itemEmoji = items2[i].emoji;
                        itemID = items2[i].id;
                        itemType = items2[i].type;
                    }
                }
            }
        }



        if (!Name.length) {
            const noItem = new MessageEmbed()
                .setTitle(`🔎 Item doesn't exist!`)
                .setDescription(`Please specify a valid item to buy, for a list of items you can do \`.shop\``)
                .setColor(colours.red)
                .setFooter('Invalid item')
                .setTimestamp()

            return message.channel.send(noItem)
        } else {

            UserData.findOne({
                userID: message.author.id,
            }, (err, userData) => {
                if (err) console.log(err)

                if (!userData) {
                    const newData = new UserData({
                        username: message.author.username,
                        userID: message.author.id,
                        lb: "all",
                        coins: 0,
                        items: [{ itemName: 'Free Rations', itemID: 'FreeRations', itemQuantity: 1, itemSell: 0, itemEmoji: '<:rations:707207234848817163>', itemType: 'Freebie' }]
                    })
                    newData.save().catch(err => console.log(err))

                    return errors.noCoins(message, `${Name}` || message, `${itemCost.toLocaleString()}`)

                } else {

                    if (userData.coins < itemCost) {
                        return errors.noCoins(message, `${Name}` || message, `${itemCost.toLocaleString()}`)
                    }

                    if (userData.items.itemName > 3) {
                        return message.channel.send('You can only have 3 of one item.')
                    }

                    UserData.updateOne(
                        { userID: message.author.id },
                        {
                            $push: {
                                items: {
                                    'itemName': Name,
                                    'itemID': itemID,
                                    'itemQuantity': 1,
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
                    .setDescription(`You successfully bought **${Name}** for \`S$${itemCost}\` from the Military Market!`)
                    .setFooter('Successful Purchase')
                    .setTimestamp()
                    .setColor(colours.green)

                message.channel.send(success)
            })
        }
    }
}