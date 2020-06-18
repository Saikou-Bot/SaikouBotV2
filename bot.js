// -- Requiring modules
const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');
const bot = new Client({ ws: { intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILDS', 'DIRECT_MESSAGES'] } });
const mongoose = require('mongoose');


// -- Setting .env path
config({
	path: __dirname + '/.env',
});

['aliases', 'commands', 'items'].forEach((x) => (bot[x] = new Collection()));
['command', 'event', 'items'].forEach((x) => require(`./handlers/${x}`)(bot));

mongoose.connect(process.env.MONGOPASSWORD, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});


// ---Logging in with token or test token---
const token = process.env.TEST === 'true' ? process.env.TESTTOKEN : process.env.TOKEN;
bot.login(token);
