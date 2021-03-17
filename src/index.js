const SaikouBot = require('./client/SaikouBot');
// const chalk = require('chalk');

let config = {};
try {
	config = require('../config.json');
}
catch(err) {
	console.error(err);
}

const bot = new SaikouBot(config);

bot.init();
bot.login();