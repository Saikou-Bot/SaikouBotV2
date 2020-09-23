module.exports = {
	config: {
		name: 'exit'
	},
	async run({ message }) {
		const { channel, author } = message;

		if (!process.env.OWNERS.includes(author.id)) return message.reply('Owner only');

		process.exit(0);
	}
}