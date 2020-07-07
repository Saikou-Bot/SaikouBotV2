const items = require('../../models/items');

module.exports = {
	config: {
		name: 'deleteitem',
		description: 'Deletes an item from the database.',
		usage: '.deleteitem <name>',
		accessableby: 'Bot Developer',
		aliases: ['removeitem'],
	},
	run: async ({ client: bot, message, args }) => {

		if (!process.env.owners.includes(message.author.id)) return message.channel.send('This command is limited to bot developers only.');

		const Name = args.join(' ');

		if (!Name) {
			return message.channel.send('Input an item to remove');
		}

		items.findOne({ name: Name }, (err, item) => {

			if (!item) {
				return message.channel.send('That item does not exist!');
			}

			items.deleteOne({ name: Name }).then(
				message.channel.send('item Deleted!'),
			);

		});

	},
};
