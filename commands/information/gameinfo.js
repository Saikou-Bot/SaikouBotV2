const axios = require('axios');

const apiEndpoints = {
	'multiget-place': 'https://games.roblox.com/v1/games/multiget-place-details?placeIds=',
	'headshot': 'https://thumbnails.roblox.com/v1/users/avatar-headshot?format=Png&isCircular=true&size=420x420&userIds=',
	'thumbnail': 'https://thumbnails.roblox.com/v1/games/icons?format=Png&isCircular=true&returnPolicy=PlaceHolder&size=150x150&universeIds=',
	'gamesearch': 'https://games.roblox.com/v1/games/list?model.maxRows=1&model.keyword=',
	'gameinfo': 'https://games.roblox.com/v1/games?universeIds='
}

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
		const token = noblox.options.jar.session
		const { channel } = message;

		const gameNotFound = new MessageEmbed({
			title: 'Game not found',
			color: colours.red
		})

		let gameid = args.gameid || 62124643;

		console.log(gameid);

		const gameInfo = {};

		// get gameid (search or from args)
		if (isNaN(gameid)) {
			const failedSearch = new MessageEmbed({
				title: 'Failed to search game',
				color: colours.red
			});
			let searchResults;
			try {
				searchResults = await axios.get(apiEndpoints['gamesearch'] + gameid);
			}
			catch(err) {
				console.error(err);
				return channel.send(failedSearch);
			}
			if (!searchResults.data || !searchResults.data.games) return channel.send(failedSearch);
			if (searchResults.data.games.length < 1) return channel.send(gameNotFound);
			let game = searchResults.data.games[0]
			// gameid = game.
		}
		else {
			const failedFetch = new MessageEmbed({
				title: 'Failed to fetch game',
				color: colours.red
			});
			let gamePlace;
			try {
				gamePlace = await axios.get(apiEndpoints['multiget-place'] + gameid, {
					headers: {
						'Cookie': '.ROBLOSECURITY=' + token
					}
				});
			}
			catch(err) {
				console.error(err);
				return channel.send(failedFetch);
			}
			if (!gamePlace.data) return channel.send(failedFetch);
			let game = gamePlace.data[0];
			if (!game) return channel.send(gameNotFound);
			console.log(game);
			gameInfo.name = game.name;
			gameInfo.description = game.description;
			gameInfo.url = game.url;
			gameInfo.builder = game.builder;
			gameInfo.builderId = game.builderId;
		}

		const gameEmbed = new MessageEmbed({
			title: gameInfo.name,
			description: gameInfo.description,
		// 	url: game.url,
			author: {
				name: gameInfo.builder,
		// 		iconURL: headshotImage,
				url: `https://www.roblox.com/users/${gameInfo.builderId}/profile`
			},
			color: colours.green,
		// 	thumbnail: {
		// 		url: thumbnailImage,
		// 	}
		});
		channel.send(gameEmbed);
	}
}
