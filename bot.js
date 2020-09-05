// -- Requiring modules
const chalk = require('chalk');
const discord = require('discord.js');
const { Client, Collection, MessageEmbed } = discord;
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const bot = new Client({ ws: { intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_REACTIONS'] }, partials: ['MESSAGE', 'REACTION'] });

global.colours = require('./jsonFiles/colours.json');
global.discord = discord;
global.MessageEmbed = MessageEmbed;


// -- Setting .env path
dotenv.config({
	path: __dirname + '/.env',
});

dotenv.config({
	path: __dirname + '/.env.example',
});

const defaultConfig = require('./default.config.json');

global.config = Object.assign({}, defaultConfig, process.env.CONFIG ? (() => {
	try {
		return JSON.parse(process.env.config);
	}
	catch(err) {
		console.error(err);
		return {}
	}
})() : (() => {
	try {
		return require('./config.json');
	}
	catch(err) {
		if (err.code != 'MODULE_NOT_FOUND') console.error(err);
		return {}
	}
})());

['aliases', 'commands'].forEach((x) => (bot[x] = new Collection()));
(async () => {
	for (let i = 0; i < config.handlers.length; i++) {
		const handler = config.handlers[i];
		try {
			await (require(`./handlers/${handler}`))(bot);
		}
		catch(err) {
			console.error(err);
			console.error(`${chalk.bgYellow('Failed')} loading handler ${chalk.bold(handler)}`);
		}
	}

	if (!process.env.review) {
		mongoose.connect(process.env.MONGOPASSWORD, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		});
		// ---Logging in with token or test token---
		const token = process.env.TEST == 'true' ? process.env.TESTTOKEN : process.env.TOKEN;
		bot.login(token);
	}
	else {
		bot.destroy();
	}
})();