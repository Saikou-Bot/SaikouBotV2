const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const modelFolder = path.join(__dirname, '../models');

module.exports = (client) => {
	client.databases = {};
	fs.readdirSync(modelFolder).filter(m => m.endsWith('.js')).forEach(modelName => {
		try {
			client.databases[modelName.split('.')[0]] = require(`../models/${modelName}`);
		}
		catch(err) {
			console.error(err);
			console.error(`${chalk.bgYellow('Failed')} loading database ${modelName}`);
		}
	});
};
