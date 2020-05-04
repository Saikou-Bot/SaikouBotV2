// -- Requiring modules
const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');
const bot = new Client();

// -- Setting .env path
config({
  path: __dirname + '/.env',
});

['aliases', 'commands'].forEach((x) => (bot[x] = new Collection()));
['command', 'event'].forEach((x) => require(`./handlers/${x}`)(bot));



// ---Logging in with token or test token---
const token = process.env.TEST == 'true' ? process.env.TESTTOKEN : process.env.TOKEN;
bot.login(token);
