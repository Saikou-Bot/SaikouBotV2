const childProcess = require('child_process');

module.exports = {
	config: {
		name: 'commit'
	},
	async run({ message }) {
		const { channel, author } = message;

		if (!process.env.OWNERS.includes(author.id)) return embeds.owner(message);

		const commitName = childProcess.execSync('git log -1 --pretty=format:"%h: %s"').toString();

		if (!commitName) return message.reply('No commit name');

		channel.send('`' + commitName.trim() + '`');
	}
};