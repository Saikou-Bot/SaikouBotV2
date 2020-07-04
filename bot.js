// -- Requiring modules
console.time('bot.js');
console.time('require modules');
const chalk = require('chalk');
const discord = require('discord.js');
const { Client, Collection, MessageEmbed } = discord;
const { config } = require('dotenv');
const mongoose = require('mongoose');
console.timeEnd('require modules');

const bot = new Client({ ws: { intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_REACTIONS'] } });

global.colours = require('./jsonFiles/colours.json');
global.discord = discord;
global.MessageEmbed = MessageEmbed;


// -- Setting .env path
console.time('env load');
config({
	path: __dirname + '/.env',
});
console.timeEnd('env load');

try {
	process.env.owners = JSON.parse(process.env.OWNERS); // parsed owners from .env
}
catch (err) {
	process.env.owners = []; // placeholder
	console.log('Failed to load owners');
	console.error(err);
}

['aliases', 'commands', 'items'].forEach((x) => (bot[x] = new Collection()));
console.time('Handlers');
(async () => {
	const handlers = ['database', 'utils', 'command', 'event', 'items']
	for (var i = 0; i < handlers.length; i++) {
		const handler = handlers[i];
		try {
			await (require(`./handlers/${handler}`))(bot);
		}
		catch(err) {
			console.error(err);
			console.error(`${chalk.bgYellow('Failed')} loading handler ${chalk.bold(handler)}`);
		}
	}
	console.timeEnd('Handlers');
})();

console.time('mongoose connect');
mongoose.connect(process.env.MONGOPASSWORD, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});
console.timeEnd('mongoose connect');


// ---Logging in with token or test token---
const token = process.env.TEST == 'true' ? process.env.TESTTOKEN : process.env.TOKEN;
bot.login(token);

console.timeEnd('bot.js')
