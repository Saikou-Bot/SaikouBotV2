const millify = require('millify').default;

module.exports = {
	config: {
		name: 'gameinfo',
		arguments: {
			'gameid': false
		}
	},
	async run({ message, args, utils: { gameManager, userManager } }) {
		message.channel.startTyping();
		const gameData = await gameManager.get(args.gameid || '62124643');
		const [ fullData, faveCount, votes, gameIcon, userIcon ] = await Promise.all([
			gameData.fetchGame(),
			gameData.favoritesCount(),
			gameData.votes(),
			gameData.icon(),
			userManager.headshot(gameData.builderId)
		]);
		message.channel.stopTyping();

		const embed = new MessageEmbed({
			title: gameData.name,
			url: gameData.url,
			description: gameData.description,
			author: {
				name: gameData.builder,
				url: `https://www.roblox.com/users/${gameData.builderId}/`,
				iconURL: userIcon
			},
			thumbnail: {
				url: gameIcon
			},
			fields: [
				{ name: 'Votes', value: Math.round((votes.upVotes / (votes.upVotes + votes.downVotes)) * 100) + '%', inline: true },
				{ name: 'Favorites', value: millify(faveCount), inline: true },
				{ name: 'Visits', value: millify(fullData.visits), inline: true }
			],
			footer: { text: 'Created' },
			timestamp: new Date(fullData.created),
			color: colours.green
		});
		message.channel.send(embed);
	}
};