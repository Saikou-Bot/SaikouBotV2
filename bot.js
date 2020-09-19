// -- Requiring modules
const chalk = require('chalk');
const discord = require('discord.js');
const { Client, Collection, MessageEmbed } = discord;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const noblox = require('noblox.js');

const bot = new Client({ ws: { intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_REACTIONS'] }, partials: ['MESSAGE', 'REACTION'] });

bot.noblox = noblox;

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

	Object.getOwnPropertyNames(err).filter(p => !['name', 'message', 'stack'].includes(p))
		.forEach(p => {
			const value = err[p];
			if (value && typeof value.toString == 'function') {
				embed.addField(p, value, true);
			}
		});

	return bot.channels.cache.get('718074355589840987').send(embed).catch(() => {});
}

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
		return {};
	}
})() : (() => {
	try {
		return require('./config.json');
	}
	catch(err) {
		if (err.code != 'MODULE_NOT_FOUND') console.error(err);
		return {};
	}
})());

class UnhandledRejection extends Error {
	constructor(reason) {
		if (reason instanceof Error) {
			super(reason instanceof Error ? `${reason.name}: ${reason.message}` : reason);
			Object.getOwnPropertyNames(reason).filter(p => !['name', 'message', 'stack'].includes(p))
				.forEach(p => {
					this[p] = reason[p];
				});
		}
		else {
			super(reason);
		}
		this.name = 'UnhandledRejection';
		this.stack = '';
	}
}

if (config.logErrors == true) {
	process.on('uncaughtException', async (err, origin) => {
		_error.apply(console, [err]);
		try {
			await logError(err, 'UncaughtException');
		}
		catch(err) {} // eslint-disable-line no-empty

		process.exit(1);
	});

	const _error = console.error;
	console.error = function() {
		logError(arguments[0], 'Stderr');
		_error.apply(console, arguments);
	};
	process.on('unhandledRejection', (reason) => {
		const error = new UnhandledRejection(reason);
		logError(error, 'UnhandledRejection');
		_error.apply(console, [error]);
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
		if (process.env.COOKIE) {
			noblox.setCookie(process.env.COOKIE);
		}
	}
	else {
		bot.destroy();
	}
})();
