const SaikouBot = require('./client/SaikouBot');
require('dotenv').config();
const logger = require('./util/logger');

let config = {};
try {
	config = require('../config.json');
}
catch(err) {
	logger.warn(err);
}

const bot = new SaikouBot(Object.assign({}, {
	prefix: process.env.PREFIX,
	token: process.env.DISCORD_TOKEN
}, config));

bot.start();