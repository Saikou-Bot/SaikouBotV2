const Path = require('path');

module.exports = {
	name: 'loadCommand',
	construct(client) {
		return (path) => {
			const commandPath = `../commands/${path}`;
			delete require.cache[require.resolve(commandPath)];
			const pull = require(commandPath);
			if (!pull || !pull.config) return;
			if (pull.config.cooldown) {
				pull.cooldown = new client.utils.cooldown({
					name: pull.config.name,
					cooldown: pull.config.cooldown === true ? undefined : pull.config.cooldown,
					roles: pull.config.cooldownRoles,
				});
			}
			pull.path = path;
			client.commands.set(pull.config.name, pull);
			if (pull.config.aliases) pull.config.aliases.forEach(a => client.aliases.set(a, pull.config.name));
			return pull;
		}
	}
}