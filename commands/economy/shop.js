const { MessageEmbed } = require('discord.js');
const pagination = require('discord.js-pagination');
const items2 = require('../../jsonFiles/items2.json');


module.exports = {
    config: {
        name: 'shop',
        description: 'Displays a shop where people can purchase items.',
        usage: '.shop/market/store',
        accessableby: 'Public',
        aliases: ['market', 'store'],
    },
    run: async (bot, message) => {

        let itemDesc = '';
        let itemDesc2 = '';

        // Shop Menu 1
        const shopMenu = new MessageEmbed()
            .setTitle('Military Market');


        bot.shop.forEach(a => {
            itemDesc += `${a.emoji} **${a.name}** **─**  ${a.cost.toLocaleString()} S$ **─** ${a.type}\n${a.description}\n\n`;
        });


        shopMenu.setDescription('Welcome to the Military Market! Kit yourself out with some cool items and begin the journey to making powerful decisions. Buy an item with `.buy itemname`');
        shopMenu.addField('Purchasable Powerups:', itemDesc);
        shopMenu.setColor(message.member.displayHexColor);
        shopMenu.setFooter('Page 1/3');


        // Shop Menu 2
        const shopMenu2 = new MessageEmbed()
            .setTitle('Military Market');

        items2.forEach(a => {
            itemDesc2 += `${a.emoji} **${a.name}** **─**  ${a.cost.toLocaleString()} S$ **─** ${a.type}\n${a.description}\n\n`;
        });


        shopMenu2.setDescription('Welcome to the Military Market! Kit yourself out with some cool items and begin the journey to making powerful decisions. Buy an item with `.buy itemname`');
        shopMenu2.addField('Purchasable Cosmetics:', itemDesc2);
        shopMenu2.setColor(message.member.displayHexColor);
        shopMenu2.setFooter('Page 2/3');

        const pages = [shopMenu, shopMenu2];
        const emojiList = ['⬅️', '➡️'];
        const timeout = '60000';

        pagination(message, pages, emojiList, timeout);

    },
};