const fs = require('fs');
const Path = require('path');
const chokidar = require('chokidar');
const chalk = require('chalk');

class CommandWatcher {
	constructor(client, commandsPath) {
		this.client = client;
		this.commandsPath = commandsPath;
		this.watcher = chokidar.watch(commandsPath)
			.on('ready', () => {
				this.watcher.on('change', (path) => this.reloadCommand(path))
				.on('add', (path) => this.reloadCommand(path))
				.on('unlink', (path) => {
					const { dirname, filename } = this.parse(path);
					const fullpath = `${dirname}/${filename}`;
					console.log('fullpath: ', fullpath)
					let commandFile = this.client.commands.find(c => c.path == fullpath);
					if (!commandFile) return;
					if (commandFile.aliases) commandFile.aliases.keys().forEach(alias => this.client.aliases.delete(alias));
					this.client.commands.delete(commandFile.name);
					console.log(`${chalk.bold(filename)} command ${chalk.bgRed('deleted')}`)
				});
			});
	}
	parse(path) {
		return {
			dirname: Path.basename(Path.dirname(path)),
			filename: Path.basename(path)
		}
	}
	reloadCommand(path) {
		const { dirname, filename } = this.parse(path);
		try {
			this.client.utils.loadCommand(`${dirname}/${filename}`);
		}
		catch(err) {
			console.error(err);
			console.error(`${chalk.bgYellow('Failed')} loading command ${chalk.bold(filename)}`);
			return;
		}
		console.log(`${chalk.bold(filename)} loaded`);
	}
}

module.exports = {
	name: 'watch',
	construct(client) {
		if (process.env.WATCH_COMMANDS == 'true') {
			return new CommandWatcher(client, Path.join(__dirname, '../commands'));
		}
	}
}