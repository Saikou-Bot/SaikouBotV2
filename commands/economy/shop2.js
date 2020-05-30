const { MessageEmbed } = require('discord.js');


module.exports = {
    config: {
        name: 'shop2',
        description: 'Displays a shop where people can purchase items.',
        usage: '?shop 1-3',
        accessableby: 'Public',
        aliases: ['market2', 'shop 2'],
    },
    run: async (bot, message) => {

        const items2 = require('../../jsonFiles/items2.json');

        let itemDesc = [''];


        const shopMenu2 = new MessageEmbed()
            .setTitle('Military Market');

        items2.forEach(a => {
            itemDesc += `${a.emoji} **${a.name}** **─**  ${a.cost.toLocaleString()} S$ **─** ${a.type}\n${a.description}\n\n`;
        });


        shopMenu2.setDescription('Welcome to the Military Market! Kit yourself out with some cool items and begin the journey to making powerful decisions. Buy an item with `.buy itemname`');
        shopMenu2.addField('Purchasable Cosmetics:', itemDesc);
        shopMenu2.setColor(message.member.displayHexColor);
        shopMenu2.setFooter('Page 2/3');

        message.channel.send(shopMenu2);


    },
};