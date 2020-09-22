/* eslint-disable no-shadow-restricted-names */
const { MessageEmbed, Collection } = discord;
const colours = require('../../jsonFiles/colours.json');

const maintainData = require('../../models/maintainData');

const env = process.env;
const prefix = env.PREFIX;

function parseArguments(arguments) {
	const entries = Object.entries(arguments);
	return entries.map((entry) => {
		if (entry[1]) {
			return `<${entry[0]}>`;
		}
		else {
			return `[${entry[0]}]`;
		}
	}).join(' ');
}

function error(name, command = {}, callback, ...args) {
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

	if (message.channel.name.match('suggestions')) message.delete().catch(() => {});
	if (message.channel.name.match('art') && !(message.attachments.size > 0 || message.content.startsWith('https'))) return message.delete().catch(() => {}); // TODO: Add more advanced image detection

	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();
	let argString = '';
	if (args.length > 0) {
		argString = message.content.slice(message.content.indexOf(' ') + 1);
	}

	const commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd));

	if (!commandfile || !commandfile.config) return;
	if (process.env.IGNOREMAINTENANCE != 'true' && await bot.utils.maintains.maintained(commandfile.config.name)) {
		const MaintainedEmbed = new MessageEmbed()
			.setTitle('⚠️ Under maintenance!')
			.setURL('https://chromedino.com/')
			.setDescription('Aw man, looks like our team of developers are currently working on this command, don\'t worry though you will be able to use it again soon! For now you can try...\n\n• Trying again later\n• Hoping for a miracle\n• Checking out Saikou\'s social medias whilst you wait 😏')
			.setColor(colours.yellow);

		return message.channel.send(MaintainedEmbed);
	}

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
				message.delete();
				message.channel.send(new MessageEmbed()
					.setTitle('📌 Can\'t use this channel!')
					.setDescription(`The command **${commandfile.config.name}** is limited to the **${message.guild.channels.cache.filter(c => c.name.match(commandfile.config.channel)).array().join(' or ')}** channel. Try relocating to that channel and trying again!`)
					.setColor(colours.red)).then(msg => { msg.delete({ timeout: 10000 }); });
			}, message);
			return;
		}
	}

	const cooldown = commandfile.cooldown;
	if (cooldown) {
		if (cooldown.has(message.author.id)) {
			return message.channel.send(cooldown.embed(message.author.id));
		}
		else if (commandfile.config.autoCooldown) {
			commandfile.cooldown.add(message.member);
		}
	}

	if (commandfile.config.types) {
		message.channel.startTyping();
	}

	const alertError = (errorMessage) => {
		console.error(errorMessage);
		message.channel.send(new MessageEmbed()
			.setColor(colours.red)
			.setTitle('❌ An error occurred!')
			.setDescription('Uh oh! Looks like our team of developers forgot that last screw causing an error. Please contact our bot developers if this error persists, you can try... \n\n• Re-entering the command\n• Coming back later and trying again\n• Checking out Saikou\'s social medias whilst you wait 😏'));

	};
	if (commandfile) {
		try {
			// await commandfile.run(bot, message, arguments, { maintains });
			await commandfile.run({ client: bot, message, args: arguments, utils: bot.utils, databases: bot.databases, argString, rawArgs: args });
		}
		catch (err) {
			alertError(err);
		}
		message.channel.stopTyping();
	}
};
