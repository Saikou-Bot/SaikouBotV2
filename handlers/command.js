const { readdirSync } = require('fs');
const chalk = require('chalk');

module.exports = (bot) => {
	bot.utils.commands.loadAll();
};
