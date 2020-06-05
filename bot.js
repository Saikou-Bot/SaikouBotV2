// -- Requiring modules
const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');
const bot = new Client();
const mongoose = require('mongoose');

const Filter = require('bad-words');
const badWords = new Filter();

function filter(message) {
	console.log(message.content);
	if (badWords.isProfane(message.content)) {
		message.delete()
			.catch(err => {
				message.channel.send('Bad Word');
				console.error(err);
			});
	}
}

bot.on('message', filter);
bot.on('messageUpdate', (oldMessage, message) => {
	filter(message);
});


bot.shop = new Map();
const items = require('./jsonFiles/items.json');

// -- Setting .env path
config({
  path: __dirname + '/.env',
});

['aliases', 'commands'].forEach((x) => (bot[x] = new Collection()));
['command', 'event'].forEach((x) => require(`./handlers/${x}`)(bot));

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
const token = process.env.TEST == 'true' ? process.env.TESTTOKEN : process.env.TOKEN;
bot.login(token);
