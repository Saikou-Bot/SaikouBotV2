// -- Requiring modules
const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');
const bot = new Client();
const mongoose = require('mongoose')

bot.shop = new Map()
let items = require("./items.json")

// -- Setting .env path
config({
  path: __dirname + '/.env',
});

['aliases', 'commands'].forEach((x) => (bot[x] = new Collection()));
['command', 'event'].forEach((x) => require(`./handlers/${x}`)(bot));

mongoose.connect(process.env.MONGOPASSWORD, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

items.forEach(a => {
  bot.shop.set(a.id, a)
  console.log(`Loaded item ${a.id}`)
})

// ---Logging in with token or test token---
const token = process.env.TEST == 'true' ? process.env.TESTTOKEN : process.env.TOKEN;
bot.login(token);
