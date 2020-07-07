const items = require('../../models/items');

module.exports = {
	config: {
		name: 'addshop',
		description: 'Adds an item to the shop.',
		usage: '.addshop <name>',
		accessableby: 'Bot Developer',
		aliases: ['addtoshop'],
	},
	run: async ({ client: bot, message, args }) => {

		if (!process.env.owners.includes(message.author.id)) return message.channel.send('This command is limited to bot developers only.');


		const name = args.join(' ');

		if (!name) {
			return message.channel.send('Input an item.');
		}

		items.findOne({ name: name, inshop: false }, (err, itemData) => {

			if (!itemData) {
				return message.channel.send('Please choose an item that exists and one that is not in the shop currently.');
			}

			itemData.inshop = true;
			itemData.save().then(
				message.channel.send('Item now in shop.'),
			);
		});


	},
};
