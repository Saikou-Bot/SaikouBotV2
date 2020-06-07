const { MessageEmbed } = require('discord.js');
const UserData = require('../../models/userData.js');
const errors = require('../utils/errors');
const colours = require('../../jsonFiles/colours.json');

module.exports = {
    config: {
        name: 'buy',
        description: 'Purchase an item in the shop.',
        usage: '?buy itemName',
        accessableby: 'Followers+',
        aliases: ['purchase'],
    },
    run: async (bot, message, args) => {
        const items = require('../../jsonFiles/items.json');
        const items2 = require('../../jsonFiles/items2.json');

        let Name = '';
        let itemCost = 0;
        let itemEmoji = '';
        let itemID = '';
        let itemType = '';

        for (const i in items) {
            if (args.join(' ').trim().toUpperCase() === items[i].name.toUpperCase()) {
                Name = items[i].name;
                itemCost = items[i].cost;
                itemEmoji = items[i].emoji;
                itemID = items[i].id;
                itemType = items[i].type;
            }
            else {
                for (const e in items2) {
                    if (args.join(' ').trim().toUpperCase() === items2[e].name.toUpperCase()) {
                        Name = items2[e].name;
                        itemCost = items2[e].cost;
                        itemEmoji = items2[e].emoji;
                        itemID = items2[e].id;
                        itemType = items2[e].type;
                    }
                }
            }
        }


        if (!Name.length) {
            const noItem = new MessageEmbed()
                .setTitle('🔎 Item doesn\'t exist!')
                .setDescription('Please specify a valid item to buy, for a list of items you can do `.shop`')
                .setColor(colours.red)
                .setFooter('Invalid item')
                .setTimestamp();

            return message.channel.send(noItem);
        }
        else {

            UserData.findOne({
                userID: message.author.id,
            }, (err, userData) => {
                if (err) console.log(err);

                if (!userData) {
                    const newData = new UserData({
                        username: message.author.username,
                        userID: message.author.id,
                        lb: 'all',
                        coins: 0,
                        medals: 0,
                        items: [{ itemName: 'Wooden Walls', itemID: 'WoodenWall', itemQuantity: 1, itemSell: 0, itemEmoji: '<:WoodenWall:716625054351360010>', itemType: 'Wall Defence' }],
                    });
                    newData.save().catch(err => console.log(err));

                    return errors.noCoins(message, `${Name}` || message, `${itemCost.toLocaleString()}`);

                }
                else {

                    if (userData.coins < itemCost) {
                        return errors.noCoins(message, `${Name}` || message, `${itemCost.toLocaleString()}`);
                    }


                    UserData.findOne({ userID: message.author.id, 'items.itemName': Name }, (err, itemData) => {
                        if (err) console.log(err);

                        if (!itemData) {
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
                                            'itemType': itemType,
                                        },
                                    },
                                },
                            ).catch(err => console.log(err));

                            userData.coins -= itemCost;
                            userData.save();

                            const success = new MessageEmbed()
                                .setTitle('✅ Success!')
                                .setDescription(`You successfully bought **${Name}** for \`S$${itemCost.toLocaleString()}\` from the Military Market!`)
                                .setFooter('Successful Purchase')
                                .setTimestamp()
                                .setColor(colours.green);

                            message.channel.send(success);
                        }
                        else {
                            UserData.updateOne(
                                { userID: message.author.id, 'items.itemName': Name },
                                {
                                    $inc: {
                                        'items.$.itemQuantity': 1,
                                    },
                                },
                            ).catch(err => console.log(err));

                            userData.coins -= itemCost;
                            userData.save();

                            const success2 = new MessageEmbed()
                                .setTitle('✅ Success!')
                                .setDescription(`You successfully bought **${Name}** for \`S$${itemCost.toLocaleString()}\` from the Military Market!`)
                                .setFooter('Successful Purchase')
                                .setTimestamp()
                                .setColor(colours.green);

                            message.channel.send(success2);
                        }
                    });
                }
            });
        }
    },
};
