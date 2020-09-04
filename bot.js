// -- Requiring modules
const chalk = require('chalk');
const discord = require('discord.js');
const { Client, Collection, MessageEmbed } = discord;
const { config } = require('dotenv');
const mongoose = require('mongoose');

const bot = new Client({ ws: { intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_REACTIONS'] }, partials: ['MESSAGE', 'REACTION'] });

global.colours = require('./jsonFiles/colours.json');
global.discord = discord;
global.MessageEmbed = MessageEmbed;

const stripAnsi = require('strip-ansi');

const ready = new Promise((res, rej) => bot.once('ready', res));

const na = 'N/A';
async function logError(err, origin) {
	await ready;
	if (!(err instanceof Error)) {
		err = new Error(err);
	}
	const embed = new MessageEmbed({
		title: stripAnsi(err.name) || na,
		description: stripAnsi(err.message) || na,
		color: colours.red
	});

	Object.getOwnPropertyNames(err).filter(p => !['message', 'stack'].includes(p))
		.forEach(p => {
			const value = err[p];
			if (typeof value == 'string') {
				embed.addField(p, value, true);
			}
		});

	return bot.channels.cache.get('718074355589840987').send(embed);
}

// -- Setting .env path
config({
	path: __dirname + '/.env',
});

config({
	path: __dirname + '/.env.example',
});

if (process.env.LOG_ERRORS == 'true') {
	process.on('uncaughtExceptionMonitor', (err, origin) => {
		logError(err, 'UncaughtException');
	});

	const _error = console.error;
	console.error = function() {
		logError(arguments[0], 'Stderr');
		_error.apply(console, arguments);
	};
	process.on('unhandledRejection', (err) => {
		logError(err, 'UnhandledRejection');
		_error.apply(console, [err]);
	});
}

const intercept = require('./helpers/intercept');

bot.errors = '';
bot.logs = '';

intercept(process.stderr, (str) => {
	if (typeof str == 'string') {
		bot.errors += str;
	}
});

intercept(process.stdout, (str) => {
	if (typeof str == 'string') {
		bot.logs += str;
	}
});


try {
	process.env.owners = JSON.parse(process.env.OWNERS); // parsed owners from .env
}
catch (err) {
	process.env.owners = []; // placeholder
	console.log('Failed to load owners');
	console.error(err);
}

['aliases', 'commands'].forEach((x) => (bot[x] = new Collection()));
(async () => {
	const handlers = ['database', 'utils', 'command', 'event'];
	for (let i = 0; i < handlers.length; i++) {
		const handler = handlers[i];
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