const { MessageEmbed } = require('discord.js')


module.exports = {
    config: {
        name: 'shop',
        description: 'Displays a shop where people can purchase items.',
        usage: '?shop 1-3',
        accessableby: 'Public',
        aliases: ['market', 'store']
    },
    run: async (bot, message, args) => {

        var itemDesc = "";


        let shopMenu = new MessageEmbed()
            .setTitle("Military Market")


        bot.shop.forEach(a => {
            itemDesc += `${a.emoji} **${a.name}** **─**  ${a.cost.toLocaleString()} S$ **─** ${a.type}\n${a.description}\n\n`;
        })

        shopMenu.setDescription(`Welcome to the Military Market! Kit yourself out with some cool items and begin the journey to making powerful decisions. Buy an item with \`.buy itemname\``)
        shopMenu.addField(`Purchasable Items`, itemDesc)
        shopMenu.setColor(message.member.displayHexColor)
        shopMenu.setFooter('Page 1/3')

        message.channel.send(shopMenu)


    }
}