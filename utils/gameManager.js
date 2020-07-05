const Game = require('../helpers/gameData');

module.exports = {
	name: 'gameManager',
	construct(client) {
		return new Game.GameManager(client.noblox);
	}
}