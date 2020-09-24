module.exports = {
	config: {
		name: 'reloadcommands'
	},
	async run({ message, utils }) {
		const { author } = message;

		if (!process.env.OWNERS.includes(author.id)) return embeds.owner(message);
		try {
			utils.commands.loadAll();
		}
		catch(err) {
			console.error(err);
			return message.reply('Failed loading commands');
		}

		message.reply('Succesfully loaded commands');
	}
};