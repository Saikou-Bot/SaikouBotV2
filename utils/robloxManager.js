const Game = require('../helpers/robloxApi');

module.exports = {
	name: 'rblx',
	construct(client) {
		return new Game.RobloxManager(client.noblox);
	}
}