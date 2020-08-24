const fs = require('fs');
const Path = require('path');
const chokidar = require('chokidar');

class CommandWatcher {
	constructor(client, commandsPath) {
		this.client = client;
		this.commandsPath = commandsPath;
		this.watcher = chokidar.watch(commandsPath)
			.on('change', (path) => {
				const dirname = Path.basename(Path.dirname(path));
				const filename = Path.basename(path);

				this.client.utils.loadCommand(`${dirname}/${filename}`);
				console.log(`${filename} restarted`);
			});
	}
	reloadCommand(command) {
		const pull = this.client.commands.get(command);
		return client.utils.loadCommand(Path.join(this.commandsPath, pull.path));
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