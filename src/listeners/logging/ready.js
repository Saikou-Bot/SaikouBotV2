const { Listener } = require('discord-akairo');
// const chalk = require('chalk');
const logger = require('../../util/logger');

class Ready extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready'
		});
	}
	exec() {
		logger.info(`%s is ready!`, this.client.user.username);
	}
}
module.exports = Ready;