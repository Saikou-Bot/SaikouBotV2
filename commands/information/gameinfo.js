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
		let gameId;
		if (isNaN(args.gameid)) {
			let searchResults;
			try {
				searchResults = (await axios.get(apiEndpoints['gamesearch'] + args.gameid)).data;
			}
			catch(err) {
				console.error(err);
				return channel.send('Failed to search game');
			}
			if (searchResults.games && searchResults.games.length > 0) {
				let foundGame = searchResults.games[0];
				gameId = foundGame.placeId;
			} else {
				return channel.send('Game not found');
			}
		} else {
			let gameId = args.gameid || '62124643';
		}

		let games = [];
		try {
			games = (await axios.get(apiEndpoints['multiget-place'] + gameId, {
				headers: {
					'Cookie': '.ROBLOSECURITY=' + token
				}
			})).data;
		}
		catch(err) {
			console.error(err);
			return channel.send('failed to get game');
		}
		if (!games || games.length < 1) {
			return channel.send('game not found');
		}
		const game = games[0];

		const headshot = await axios.get(apiEndpoints['headshot'] + game.builderId).catch(() => {});
		const headshotImage = headshot ? headshot.data.data[0].imageUrl : undefined;

		const thumbnail = await axios.get(apiEndpoints['thumbnail'] + game.universeId).catch(() => {});
		const thumbnailImage = thumbnail ? thumbnail.data.data[0].imageUrl : undefined;

		const gameEmbed = new MessageEmbed({
			title: game.name,
			description: game.description,
			url: game.url,
			author: {
				name: game.builder,
				iconURL: headshotImage,
				url: `https://www.roblox.com/users/${game.builderId}/profile`
			},
			color: colours.green,
			thumbnail: {
				url: thumbnailImage,
			}
		});
		channel.send(gameEmbed);
	}
}
