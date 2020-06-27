/* eslint-disable no-shadow-restricted-names */
const { MessageEmbed, Collection } = require('discord.js');
const colours = require('../../jsonFiles/colours.json');

const maintainData = require('../../models/maintainData');

const { EventEmitter } = require('events');

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

class MaintainManager extends EventEmitter {
	constructor(model) {
		super();
		this.MaintainModel = model;
		this.cache = new Collection();
		this.ttl = 10 * 60 * 1000;

		this.MaintainModel.schema.post('updateOne', async () => {
			console.log(this);
		});
	}
	isCacheExpired(item) {
		return (item.expiry.getTime() + this.ttl) < Date.now();
	}
	async getData() {
		const data = await this.MaintainModel.find({});

		data.forEach(this.updateCache, this);
		return this.cache;
	}
	updateCache(item) {
		item.expiry = new Date();
		this.cache.set(item.name, item);
	}
	async maintained(name) {
		return (await this.fetch(name)).maintained;
	}
	async fetch(name) {
		let item = this.cache.get(name);
		if (!item || this.isCacheExpired(item)) {
			item = await this.MaintainModel.findOne({ name });
			if (!item) {
				item = new maintainData({
					name
				});
				await item.save();
			}
			this.updateCache(item);
		}
		return item;
	}
	async setMaintain(name, status) {
		const item = await this.fetch(name);
		item.maintained = status;
		await item.save();
		this.updateCache(item);
		return item;
	}
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

const maintains = new MaintainManager(maintainData);

maintains.getData();

module.exports = async (bot, message) => {
	if (message.author.bot || message.channel.type === 'dm') return;
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();

	const commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd));

	if (!commandfile || !commandfile.config) return;

	if (!process.env.IGNOREMAINTENANCE == 'true' && await maintains.maintained(commandfile.config.name)) {
		const MaintainedEmbed = new MessageEmbed({
			title: '⚠️ This command is being maintained',
			description: 'the developers are working on this command',
			color: colours.yellow
		});
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
					.setDescription(`The command **${commandfile.config.name}** is limited to the **${commandfile.config.channel}** channel. Try relocating to that channel and trying again!`)
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

	const alertError = (errorMessage) => {
		console.error(errorMessage);
		message.channel.send(new MessageEmbed()
			.setColor(colours.red)
			.setTitle('❌ An error occurred!')
			.setDescription('Uh oh! Looks like our team of developers forgot that last screw causing an error. Please contact our bot developers if this error persists, you can try... \n\n• Re-entering the command\n• Coming back later and trying again\n• Checking out Saikou\'s social medias whilst you wait 😏'));

	};
	if (commandfile) {
		try {
			const promise = commandfile.run(bot, message, arguments, { maintains });
			if (promise && promise.catch) {
				promise.catch(alertError);
			}
		}
		catch (err) {
			alertError(err);
		}
	}
};
