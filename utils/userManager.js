const GameInfo = require('../helpers/gameData');

module.exports = {
	name: 'userManager',
	construct(client) {
		return new GameInfo.UserManager(client.noblox);
	}
}