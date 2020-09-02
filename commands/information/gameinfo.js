const millify = require('millify').default;

const gameNotFound = new MessageEmbed({
	title: 'Game not found',
	description: 'The game was not found',
	color: colours.red
});

module.exports = {
	config: {
		name: 'gameinfo',
		arguments: {
			'game': false
		},
		cooldown: true
	},
	async run({ message, args, argString, utils: { rblx } }) {
		const gameManager = rblx.games;
		const userManager = rblx.users;
		message.channel.startTyping();

		if (argString && !argString.match(/^\d+$/)) {
			const games = await gameManager.gameList({
				keyword: argString,
				maxRows: 1
			});
			if (games.length < 1) return message.channel.send(gameNotFound);
			args.game = games[0].placeId;
		}

		let gameData;
		try {
			gameData = await gameManager.get(args.game || '62124643');
		}
		catch(err) {
			return message.channel.send(gameNotFound);
		}

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
				url: gameIcon,
				width: 50,
				height: 50
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
		this.cooldown.add(message.member);
	}
};