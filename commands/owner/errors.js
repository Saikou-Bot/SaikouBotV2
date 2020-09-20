const stripAnsi = require('strip-ansi');

module.exports = {
	config: {
		name: 'errors',
		arguments: {
			'amount': false
		}
	},
	async run({ client, message, args }) {
		const { channel, author } = message;

		if (!process.env.OWNERS.includes(author.id)) return message.reply('Owner only');

		const amount = args.amount || 20;

		const text = stripAnsi(client.errors.trim().split('\n').splice(-amount).join('\n'));
		if (!text) return message.reply('No errors');

		const messages = wrap(text, 2038).map(t => new MessageEmbed({
			description: `\`\`\`js\n${t}\n\`\`\``,
			color: '#36393F'
		}));

		for (var i = 0; i < messages.length; i++) {
			await channel.send(messages[i]);
		}
	}
};