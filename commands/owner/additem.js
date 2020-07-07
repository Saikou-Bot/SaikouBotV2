const items = require('../../models/items');

module.exports = {
	config: {
		name: 'additem',
		description: 'Adds an item to the database.',
		usage: '.additem <name> <true/false>',
		accessableby: 'Bot Developer',
		aliases: ['additionalitem'],
	},
	run: async ({ client: bot, message, args }) => {

		if (!process.env.owners.includes(message.author.id)) return message.channel.send('This command is limited to bot developers only.');


		const name = args.join(' ').split(', ')[0];
		const inshop = args.join(' ').split(', ')[1];

		if (!name) {
			return message.channel.send('Input name');
		}

		if (!inshop) {
			return message.channel.send('Input shop');
		}

		if (inshop.toLowerCase() === 'true') {
			items.create({
				name: name,
				inshop: true,
			})
				.then(message.channel.send('Item Added!'));
		}

		else if (inshop.toLowerCase() === 'false') {
			items.create({
				name: name,
				inshop: false,
			})
				.then(message.channel.send('Item Added!'));
		}
		else {
			return message.channel.send('input true or false');
		}

	},
};
