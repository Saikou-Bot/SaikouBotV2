const Path = require('path');
const { readdirSync } = require('fs');
const chalk = require('chalk');

class CommandManager {
	constructor(client) {
		this.client = client;
	}
	load(path) {
		const commandPath = `../commands/${path}`;
		delete require.cache[require.resolve(commandPath)];
		const pull = require(commandPath);
		if (!pull || !pull.config) return;
		if (pull.config.cooldown) {
			pull.cooldown = new this.client.utils.cooldown({
				name: pull.config.name,
				cooldown: pull.config.cooldown === true ? undefined : pull.config.cooldown,
				roles: pull.config.cooldownRoles,
			});
		}
		pull.path = path;
		this.client.commands.set(pull.config.name, pull);
		if (pull.config.aliases) pull.config.aliases.forEach(a => this.client.aliases.set(a, pull.config.name));
		return pull;
	}
	loadAll() {
		['information', 'moderation', 'fun', 'economy', 'games', 'general', 'owner'].forEach(dir => {
			readdirSync(`./commands/${dir}/`).filter(d => d.endsWith('.js'))
				.forEach(file => {
					try {
						this.load(`${dir}/${file}`);
					}
					catch(err) {
						console.error(err);
						console.error(`${chalk.bgYellow('Failed')} loading command ${chalk.bold(file)}`);
					}
				});
		});
	}
}

module.exports = {
	name: 'commands',
	construct(client) {
		return new CommandManager(client);
	}
};