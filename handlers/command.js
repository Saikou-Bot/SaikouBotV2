const { readdirSync } = require('fs');
const chalk = require('chalk');

module.exports = (bot) => {
	const load = dirs => {
		const commands = readdirSync(`./commands/${dirs}/`).filter(d => d.endsWith('.js'));
		for (const file of commands) {
			try {
				bot.utils.loadCommand(`${dirs}/${file}`);
			}
			catch(err) {
				console.error(err);
				console.error(`${chalk.bgYellow('Failed')} loading command ${chalk.bold(file)}`);
			}
		}
	};
	['information', 'moderation', 'fun', 'economy', 'games', 'general', 'owner'].forEach(x => load(x));
};
