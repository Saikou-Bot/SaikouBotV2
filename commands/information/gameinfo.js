const axios = require('axios');

function genEmbed(data) {
	const fields = [];
	if (data.upVotes && data.downVotes) fields.push({ name: 'Vote', value: `${Math.round(( data.upVotes / (data.upVotes + data.downVotes)) * 100)}%`, inline: true });
	if (data.favoritesCount) fields.push({ name: 'Favorites', value: data.favoritesCount.toLocaleString(), inline: true });
	return new MessageEmbed({
		title: data.name,
		url: `https://www.roblox.com/games/${data.placeId}/`,
		description: data.description,
		thumbnail: {url: data.imageUrl},
		author: {
			name: data.builder,
			iconURL: data.builderHeadshot,
			url: `https://www.roblox.com/users/${data.builderId}/profile`
		},
		fields,
		color: colours.green,
	});
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
	async run({ client, message, args, utils: { gameInfo, robloxUser } }) {
		let data = await gameInfo.get(args.gameid || '62124643');

		const msg = message.channel.send(genEmbed(data));
		async function applyEdits() {
			(await msg).edit(genEmbed(data));
		}
		data.on('update', applyEdits);
		if (data.partail) {
			data.fetch();
		}

		data.fetchIcon()
		robloxUser.fetchHeadshot(data.builderId)
		.then(res => {
			data.builderHeadshot = res.imageUrl;
			data.emit('update');
		});
		data.fetchFaves();
		data.fetchVotes();
	}
}
