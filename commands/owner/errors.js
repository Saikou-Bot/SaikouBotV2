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

		let amount = args.amount || 20;

		const embed = new MessageEmbed({
			description: `\`\`\`js\n${stripAnsi(client.errors.trim().split('\n').splice(-amount).join('\n'))}\n\`\`\``,
			color: '#36393F'
		})

		channel.send(embed);
	}
}