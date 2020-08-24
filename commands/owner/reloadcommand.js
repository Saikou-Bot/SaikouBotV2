module.exports = {
	config: {
		name: 'reloadcommand',
		arguments: {
			'command': true
		}
	},
	async run({ client, message, utils, args }) {
		const { author } = message;
		if (!process.env.OWNERS.includes(author.id)) return message.reply('Owner only');

		const command = client.commands.get(args.command) || client.commands.get(client.aliases.get(args.command));

		if (!command) messager.reply('Unknown command');

		try {
			utils.loadCommand(command.path);
		}
		catch(err) {
			console.error(err);
			return message.reply('Failed to reload command');
		}
		message.reply('Succesfully reloaded command');
	}
}