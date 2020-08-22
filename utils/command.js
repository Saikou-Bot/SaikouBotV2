const Path = require('path');

module.exports = {
	name: 'loadCommand',
	construct(client) {
		return (path) => {
			const pull = require(path);
			if (!pull || !pull.config) return;
			if (pull.config.cooldown) {
				pull.cooldown = new client.utils.cooldown({
					name: pull.config.name,
					cooldown: pull.config.cooldown === true ? undefined : pull.config.cooldown,
					roles: pull.config.cooldownRoles,
				});
			}
			pull.path = `${Path.parse(Path.dirname(path)).name}/${Path.parse(path).base}`;
			client.commands.set(pull.config.name, pull);
			if (pull.config.aliases) pull.config.aliases.forEach(a => client.aliases.set(a, pull.config.name));
			return pull;
		}
	}
}