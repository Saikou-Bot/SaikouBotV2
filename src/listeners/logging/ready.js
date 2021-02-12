const { Listener } = require('discord-akairo');
const chalk = require('chalk');

class Ready extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready'
		});
	}
	exec() {
		console.log(`${chalk.greenBright('[SUCCESS]:')} ${chalk.cyan(this.client.user.username)}#${chalk.dim(this.client.user.discriminator)} is ${chalk.greenBright('online!')}`);
	}
}
module.exports = Ready;