/* eslint-disable max-nested-callbacks */
const { MessageEmbed } = require('discord.js');
const UserData = require('../../models/userData.js');
const userItems = require('../../models/userItems');
const items = require('../../models/items');
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

        const ItemName = args.join(' ');

        if (!ItemName) {
            return message.channel.send('Input an item.');
        }

        items.find({ name: ItemName, inshop: true }, (err, shopItems) => {

            if (!shopItems.length) {
                return message.channel.send('Input an existing item');
            }

            console.log(shopItems);

            shopItems.map((item) => {
                const itemFiles = bot.items.get(item.name);
                if (typeof itemFiles === 'undefined') {
                    return;
                }

                else {
                    UserData.findOne({ userID: message.author.id }, (err, userData) => {

                        if (!userData) {
                            const newData = new UserData({
                                username: message.author.username,
                                userID: message.author.id,
                                lb: 'all',
                                coins: 0,
                                medals: 0,
                            });
                            newData.save().catch(err => console.log(err));

                            return errors.noCoins(message, `${itemFiles.name}` || message, `${itemFiles.price.toLocaleString()}`);
                        }

                        else if (userData.coins < itemFiles.price) {
                            return errors.noCoins(message, `${itemFiles.name}` || message, `${itemFiles.price.toLocaleString()}`);
                        }

                        userItems.findOne({ userID: message.author.id, itemName: itemFiles.name }, (err, itemData) => {
                            if (err) console.log(err);

                            if (!itemData) {

                                userItems.create(
                                    {
                                        username: message.author.username,
                                        userID: message.author.id,
                                        itemName: itemFiles.name,
                                        itemQuantity: 1,
                                        itemSell: Math.floor(itemFiles.price / 2),
                                        itemEmoji: itemFiles.emoji,
                                        itemType: itemFiles.type,
                                        multipurchase: itemFiles.multipurchase,

                                    });

                                userData.coins -= itemFiles.price;
                                userData.save();

                                const success = new MessageEmbed()
                                    .setTitle('✅ Success!')
                                    .setDescription(`You successfully bought **${itemFiles.name}** for \`S$${itemFiles.price.toLocaleString()}\` from the Military Market!`)
                                    .setFooter('Successful Purchase')
                                    .setTimestamp()
                                    .setColor(colours.green);

                                message.channel.send(success);
                            }
                            else {

                                if (itemData.multipurchase === false) {
                                    return message.channel.send('You can only have one of this item.');
                                }

                                console.log(itemData.multipurchase);

                                userItems.updateOne(
                                    { userID: message.author.id, itemName: itemFiles.name }, { $inc: { itemQuantity: 1 } }, () => {
                                        userData.coins -= itemFiles.price;
                                        userData.save();

                                        const success2 = new MessageEmbed()
                                            .setTitle('✅ Success!')
                                            .setDescription(`You successfully bought **${itemFiles.name}** for \`S$${itemFiles.price.toLocaleString()}\` from the Military Market!`)
                                            .setFooter('Successful Purchase')
                                            .setTimestamp()
                                            .setColor(colours.green);

                                        message.channel.send(success2);
                                    });

                            }


                        });


                    });

                }
            });


        });


    },
};