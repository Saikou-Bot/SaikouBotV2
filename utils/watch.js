const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

class CommandWatcher {
	constructor(client, commandsPath) {
		this.client = client;
		this.commandsPath = commandsPath;
		this.watcher = chokidar.watch(commandsPath)
			.on('change', (path) => {
				this.client.utils.loadCommand(path);
			});
	}
	reloadCommand(command) {
		const pull = this.client.commands.get(command);
		return client.utils.loadCommand(path.join(this.commandsPath, pull.path));
	}
}

module.exports = {
	name: 'watch',
	construct(client) {
		return new CommandWatcher(client, path.join(__dirname, '../commands'));
	}
}