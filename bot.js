// -- Requiring modules
const { Client, Collection, MessageEmbed } = require('discord.js');
const { config } = require('dotenv');
const bot = new Client({ ws: { intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILDS', 'DIRECT_MESSAGES'] } });
const mongoose = require('mongoose');
global.colours = require('./jsonFiles/colours.json');

global.MessageEmbed = MessageEmbed;

bot.shop = new Map();
const items = require('./jsonFiles/items.json');

// -- Setting .env path
config({
	path: __dirname + '/.env',
});

try {
	process.env.owners = JSON.parse(process.env.OWNERS); // parsed owners from .env
}
catch (err) {
	process.env.owners = []; // placeholder
	console.log('Failed to load owners');
	console.error(err);
}

['aliases', 'commands', 'items'].forEach((x) => (bot[x] = new Collection()));
['command', 'event', 'items'].forEach((x) => require(`./handlers/${x}`)(bot));

mongoose.connect(process.env.MONGOPASSWORD, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

items.forEach(a => {
	bot.shop.set(a.id, a);
	console.log(`Loaded item ${a.id}`);
});


// ---Logging in with token or test token---
process.env.test = process.env.TEST == 'true';
const token = process.env.test ? process.env.TESTTOKEN : process.env.TOKEN;
bot.login(token);
