const dotenv = require('dotenv');
dotenv.config();
const env = process.env;
const prefix = env.PREFIX;


module.exports = async (bot, message) => {
	if (message.author.bot || message.channel.type === 'dm') return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();

	if (!message.content.startsWith(prefix)) return;
	const commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd));
	const alertError = (error) => {
		console.log(error);
		message.channel.send('Failed to run command');
	}
	if (commandfile) {
		try {
			commandfile.run(bot, message, args).catch(alertError);
		} catch (error) {
			alertError(error);
		}
	};
};