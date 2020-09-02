const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const utilsFolder = path.join(__dirname, '../utils');

module.exports = async (client) => {
	client.utils = {};
	const utilFiles = ['warn', 'antiSpam', 'cooldown', 'embeds', 'getMember', 'getUserMod', 'maintains', 'suggestions', 'swearFilter'];

	for (let i = 0; i < utilFiles.length; i++) {
		const utilName = utilFiles[i];
		let util;
		try {
			util = require(path.join(utilsFolder, utilName));
			if (!util) throw new Error('Empty utl');
			if (!util.name || typeof util.name != 'string') throw new Error('No name');
			if (!util.construct || typeof util.construct != 'function') throw new Error('No constructor');
			client.utils[util.name] = await util.construct(client);
		}
		catch(err) {
			console.error(err);
			console.error(`${chalk.bgYellow('Failed')} loading util ${chalk.bold(utilName)}`);
		}
	}
};
