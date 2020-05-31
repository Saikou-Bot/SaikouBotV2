/* eslint-disable no-inline-comments */
const { MessageEmbed } = require('discord.js');
const coinsData = require('../../models/userData.js');
const { getMember } = require('../utils/getMember');


module.exports = {
    config: {
        name: 'balance',
        description: 'Displays the users balance.',
        usage: '?bal',
        accessableby: 'Public',
        aliases: ['bal', 'b', 'money', 'coins', 'cash'],
    },
    run: async (bot, message, args) => {

        const user = getMember(message, args.join(' '));

        const statuses = [
            'Very Poor',
            'Broke',
            'Sustainable',
            'Wealthy',
            'Very Wealthy',
            'Rich',
            'Filthy Rich',
        ];


        coinsData.findOne({
            userID: user.id,
        }, (err, UserData) => {
            if (err) console.log(err);

            if (!UserData) {
                const newData = new coinsData({
                    username: user.user.username,
                    userID: user.id,
                    lb: 'all',
                    coins: 0,
                    medals: 0,
                    items: [{ itemName: 'Wooden Walls', itemID: 'WoodenWall', itemQuantity: 1, itemSell: 0, itemEmoji: '<:WoodenWall:716625054351360010>', itemType: 'Wall Defence' }],
                });
                newData.save().catch(err => console.log(err));

                const BalanceEmbed1 = new MessageEmbed()
                    .setTitle(`💰${user.displayName}'s balance`)
                    .setDescription('**Credits:** 0\n**Medals:** 0\n**Total:** 0')
                    .setColor(user.displayHexColor)
                    .setFooter('Status: Very Poor')
                    .setTimestamp();


                return message.channel.send(BalanceEmbed1);

            }
            else {

                let status = new String();
                if (UserData.coins > 0 && UserData.coins < 1000) { status += `${statuses[0]}`; } // Very Poor
                else if (UserData.coins > 999 && UserData.coins < 10000) { status += `${statuses[1]}`; } // Broke
                else if (UserData.coins > 9999 && UserData.coins < 50000) { status += `${statuses[2]}`; } // Sustainable
                else if (UserData.coins > 49999 && UserData.coins < 150000) { status += `${statuses[3]}`; } // Wealthy
                else if (UserData.coins > 149999 && UserData.coins < 500000) { status += `${statuses[4]}`; } // Very Wealthy
                else if (UserData.coins > 499999 && UserData.coins < 1000000) { status += `${statuses[5]}`; } // Rich
                else if (UserData.coins > 999999 && UserData.coins < 1999999999) { status += `${statuses[6]}`; } // Filthy Rich
                else { status += `${statuses[0]}`; }


                const total = parseInt(UserData.coins) + parseInt(UserData.medals);

                const BalanceEmbed2 = new MessageEmbed()
                    .setTitle(`💰${user.displayName}'s balance`)
                    .setDescription(`**Credits:** ${UserData.coins.toLocaleString()} \n**Medals:** ${UserData.medals.toLocaleString()}\n**Total:** ${total.toLocaleString()}`)
                    .setColor(user.displayHexColor)
                    .setFooter(`Status: ${status}`)
                    .setTimestamp();


                return message.channel.send(BalanceEmbed2);
            }
        });
    },


};
