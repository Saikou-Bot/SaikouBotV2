const axios = require('axios');

module.exports = {
	config: {
		name: 'gameinfo',
		cooldown: 10000,
		autoCooldown: true,
		arguments: {
			'gameid': false
		}
	},
	async run(client, message, args, { noblox }) {



		// const gameEmbed = new MessageEmbed({
		// 	title: gameInfo.name,
		// 	description: gameInfo.description,
		// 	url: game.url,
		// 	author: {
		// 		name: gameInfo.builder,
		// 		iconURL: headshotImage,
		// 		url: `https://www.roblox.com/users/${gameInfo.builderId}/profile`
		// 	},
		// 	color: colours.green,
		// 	thumbnail: {
		// 		url: thumbnailImage,
		// 	}
		// });
		// channel.send(gameEmbed);
	}
}
