module.exports = {
	config: {
		name: 'reloadcommand',
		arguments: {
			'command': true
		}
	},
	async run({ client, message, utils, args }) {
		const { author } = message;
		if (!process.env.OWNERS.includes(author.id)) return embeds.owner(message);

		const command = client.commands.get(args.command) || client.commands.get(client.aliases.get(args.command));

		if (!command) message.reply('Unknown command');

		try {
			utils.commands.load(command.path);
		}
		catch(err) {
			console.error(err);
			return message.reply('Failed to reload command');
		}
		message.reply('Succesfully reloaded command');
	}
};