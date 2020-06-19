/* eslint-disable no-shadow-restricted-names */
const { MessageEmbed } = require('discord.js');
const colours = require('../../jsonFiles/colours.json');

const env = process.env;
const prefix = env.PREFIX;

function parseArguments(arguments) {
	const entries = Object.entries(arguments);
	console.log(entries);
	return entries.map((entry) => {
		if (entry[1]) {
			return `<${entry[0]}>`;
		}
		else {
			return `[${entry[0]}]`;
		}
	}).join(' ');
}

function error (name, command = {}, callback, ...args) {
	if (command.on) {
		const eventFunc = command.on[name];
		if (eventFunc && typeof eventFunc == 'function') {
			return eventFunc(...args);
		}
	}
	callback(...args);
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
		const requiredArgs = Object.values(commandfile.config.arguments).filter(key => key);
		if (args.length < requiredArgs.length) {
			return error('incorrectArguments', commandfile, () => {
				// im not good at embeds, you can change it to something more proper
				const usage = `${prefix}${commandfile.config.name} ${parseArguments(commandfile.config.arguments)}`;
				const embed = new MessageEmbed()
					.setTitle('📋 Incorrect Usage')
					.setDescription(`**Command Name:** ${commandfile.config.name}\n**Usage:** ${usage}`)
					.setColor(colours.red)
					.setFooter('<> - Required ● Optional - [] ');
				message.channel.send(embed);
			}, message);
		}
		arguments = Object.keys(commandfile.config.arguments).reduce((obj, key, index) => {
			return {
				...obj,
				[key]: args[index],
			};
		}, {});
	}
	else {
		arguments = args;
	}

	if (commandfile.config.channel) {
		if (message.channel.name.match(commandfile.config.channel) == null) {
			error('incorrectChannel', commandfile, () => {
				message.channel.send('Incorrect channel'); // pls make better embed
			}, message);
			return;
		}
	}

	if (commandfile.cooldown) {
		const cooldown = commandfile.cooldown;
		if (cooldown.has(message.author.id)) {
			return message.channel.send(cooldown.embed(message.author.id));
		}
		else if (commandfile.config.autoCooldown) {
			commandfile.cooldown.add(message.member);
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
		}
		catch (error) {
			alertError(error);
		}
	}
};
