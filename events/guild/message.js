const env = process.env;
const prefix = env.PREFIX;


module.exports = async (bot, message) => {
	if (message.author.bot || message.channel.type === 'dm') return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();

	if (!message.content.startsWith(prefix)) return;
	const commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd));

	if (!commandfile) return;
	if (commandfile.config && commandfile.config.channel) {
		if (message.channel.name.match(commandfile.config.channel) == null) {
			if (typeof commandfile.error == 'function') {
				commandfile.error('incorrectChannel', message);
			}
			return;
		};
	}

	if (commandfile.cooldown) {
		const cooldown = commandfile.cooldown;
		if (cooldown.has(message.author.id)) {
			return message.channel.send(cooldown.embed(message.author.id));
		} else {
			cooldown.add(message.member);
		}
	}

	const alertError = (error) => {
		console.log(error);
		message.channel.send('Failed to run command');
	}
	if (commandfile) {
		try {
			var promise = commandfile.run(bot, message, args);
			if (promise && promise.catch) {
				promise.catch(alertError);
			}
		} catch (error) {
			alertError(error);
		}
	};
};