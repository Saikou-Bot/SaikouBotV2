const UserData = require('../../models/userData.js');
const { MessageEmbed } = require('discord.js');
const { getMember } = require('../utils/getMember');

module.exports = {
    config: {
        name: 'inventory',
        description: 'Shows a users inventory.',
        usage: '.inventory',
        accessableby: 'Followers+',
        aliases: ['inv'],
    },
    run: async (bot, message, args) => {

        const user = getMember(message, args.join(' '));

        UserData.findOne({
            userID: user.id,
        }, (err, userData) => {
            if (err) console.log(err);

            if (!userData) {
                const newData = new UserData({
                    username: user.user.username,
                    userID: user.id,
                    lb: 'all',
                    coins: 0,
                    medals: 0,
                    items: [{ itemName: 'Wooden Walls', itemID: 'WoodenWall', itemQuantity: 1, itemSell: 0, itemEmoji: '<:WoodenWall:716625054351360010>', itemType: 'Wall Defence' }],
                });
                newData.save().catch(err => console.log(err));

                const FreeRationsInv = new MessageEmbed()
                    .setTitle(`${user.displayName}'s inventory`)
                    .setDescription('All your owned items are stored here! Check them out and maybe use one or two with `.use itemName`')
                    .addField('Your items:', '<:rations:707207234848817163> **x 1** **∙** `Free Rations` **-** Freebie\nSells for: S$0\n\n')
                    .setColor(user.displayHexColor);

                return message.channel.send(FreeRationsInv);

            }
            else {


                let invdesc = '';

                const embed = new MessageEmbed()
                    .setTitle(`${user.displayName}'s inventory`)
                    .setDescription('All your owned items are stored here! Check them out and maybe use one or two with `.use itemName`\n\n')
                    .setColor(user.displayHexColor);


                userData.items.forEach(a => {
                    invdesc += `${a.itemEmoji} **x ${a.itemQuantity}** **∙** \`${a.itemName}\` **-** ${a.itemType}\nSells for: S$${a.itemSell.toLocaleString()}\n\n`;
                });

                embed.addField('Your items:', invdesc);

                message.channel.send(embed);


            }

        });


    },
};