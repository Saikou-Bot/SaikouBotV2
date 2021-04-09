const SaikouBot = require('./client/SaikouBot');
require('dotenv').config();
const logger = require('./util/logger');

let config = {};
try {
	config = require('../config.json');
}
catch(err) {
	if (!err.code === 'MODULE_NOT_FOUND') logger.warn(err);
}

const bot = new SaikouBot(Object.assign({}, {
	prefix: process.env.PREFIX,
	token: process.env.DISCORD_TOKEN
}, config));

bot.start();