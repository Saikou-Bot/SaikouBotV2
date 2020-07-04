const DBItems = require('../../models/items');

module.exports = {
	config: {
		name: 'shop',
		description: 'Displays a shop where people can purchase items.',
		usage: '.shop',
		accessableby: 'Followers+',
		aliases: ['market', 'store'],
		channel: 'bot-commands'
	},
	run: async ({ client: bot, message }) => {

		let description = '';

		DBItems.find({ inshop: true }, (err, shopItems) => {
			if (err) { console.log(err); }


			const shopEmbed = new MessageEmbed()
				.setTitle('🗡️ Military Market')
				.setColor(message.member.displayHexColor);

			shopItems.map((item) => {
				const itemFiles = bot.items.get(item.name);
				if (typeof itemFiles === 'undefined') {
					return;
				}
				description += `${itemFiles.emoji} **${itemFiles.name}** - ${itemFiles.category}\n${itemFiles.description}\n\`PRICE\` **${itemFiles.price.toLocaleString()}** credits\n\n`;

			});

			shopEmbed.setDescription(`Kit yourself out with some awesome items that will allow you to grow your arsenal.\n\n**Purchase an item with** \`.buy <itemName>\`\n\n${description}`);
			shopEmbed.setFooter('Page 1 | 3');


			message.channel.send(shopEmbed);


		});
	},

};
