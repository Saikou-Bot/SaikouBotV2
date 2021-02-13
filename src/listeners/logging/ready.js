const { Listener } = require('discord-akairo');
// const chalk = require('chalk');
const bot = require('debug')('bot:info');

class Ready extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready'
		});
	}
	exec() {
		bot(`%s is ready!`, this.client.user.username);
	}
}
module.exports = Ready;