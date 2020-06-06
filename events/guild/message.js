const env = process.env;
const prefix = env.PREFIX;

const { MessageEmbed } = require('discord.js');

function parseArguments(arguments) {
	const entries = Object.entries(arguments);
	console.log(entries);
	return entries.map((entry) => {
		if (entry[1]) {
			return `[${entry[0]}]`;
		} else {
			return `<${entry[0]}>`;
		}
	}).join(' ');
}

module.exports = async (bot, message) => {
	if (message.author.bot || message.channel.type === 'dm') return;
	if (!message.content.startsWith(prefix)) return;
	
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();

	const commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd));
	if (!commandfile || !commandfile.config) return;

	let arguments;

	if (commandfile.config.arguments) {
		if (args.length < Object.keys(commandfile.config.arguments).length) {
			console.log('not enough args')
			if (!commandfile.config.defaultIncorrectArgs && typeof commandfile.error == 'function') {
				console.log('bad');
				commandfile.error('incorrectArguments', message);
			} else {
				console.log('good');
				// im not good at embeds, you can change it to something more proper
				let usage = `${prefix}${commandfile.config.name} ${parseArguments(commandfile.config.arguments)}`;
				const embed = new MessageEmbed({
					title: 'Incorrect Usage',
					description: `Usage: \`${usage}\``
				}).setColor('RED');
				return message.channel.send(embed);
			}
		};
		arguments = Object.entries((commandfile.config.arguments)).map((entry, index) => entry[1] = args[index]);
	} else {
		arguments = args;
	}

	if (commandfile.config.channel) {
		if (message.channel.name.match(commandfile.config.channel) == null) {
			if (typeof commandfile.error == 'function') {
				commandfile.error('incorrectChannel', message);
			}
			return;
		}
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
	};
	if (commandfile) {
		try {
			const promise = commandfile.run(bot, message, arguments);
			if (promise && promise.catch) {
				promise.catch(alertError);
			}
		} catch (error) {
			alertError(error);
		}
	}
};