const items = require('../../models/items');

module.exports = {
	config: {
		name: 'removeshop',
		description: 'removes an item from the shop.',
		usage: '.removeshop <itemName>',
		accessableby: 'Bot Developer',
		aliases: ['removetoshop'],
	},
	run: async ({ client: bot, message, args }) => {

		if (message.author.id !== '229142187382669312' ? message.author.id !== '670588428970098708' : message.author.id !== '229142187382669312') {
			return message.channel.send('This command is limited to bot developers only.');
		}


		const name = args.join(' ');

		if (!name) {
			return message.channel.send('Input an item.');
		}

		items.findOne({ name: name, inshop: true }, (err, itemData) => {

			if (!itemData) {
				return message.channel.send('Please choose an item that exists and one that is in the shop currently.');
			}

			itemData.inshop = false;
			itemData.save().then(
				message.channel.send('Item no longer in shop.'),
			);
		});


	},
};
