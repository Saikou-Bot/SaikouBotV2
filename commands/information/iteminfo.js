const dateRegex = /\/Date\((\d+)\)\//;

module.exports = {
	config: {
		name: 'iteminfo',
		cooldown: true,
		autoCooldown: true,
		arguments: {
			id: true
		}
	},
	async run({
		message,
		utils: {
			rblx: {
				catalog: catalogManager
			}
		},
		args
	}) {
		message.channel.startTyping();
		let searchResults;

		try {
			searchResults = await catalogManager.search({
				Keyword: args.id,
				Category: 1,
				SortType: 0
			});
		}
		catch (err) {
			console.error(err);
			return message.channel.send(new discord.MessageEmbed({
				title: 'Failed searching item',
				color: colours.red
			}));
		}

		if (searchResults.length < 1)
			return message.channel.send(new discord.MessageEmbed({
				title: 'Item not found',
				color: colours.green
			}));


		const searchResult = searchResults[0];

		console.log(searchResult);

		const url = new URL(searchResult.AbsoluteUrl);
		url.search = '';

		const embed = new MessageEmbed({
			url: url.href,
			title: searchResult.Name,
			description: searchResult.Description,
			thumbnail: {
				url: searchResult.ThumbnailUrl
			},
			fields: [{
				name: 'Price',
				value: `\`${searchResult.Price}r$\``
			}],
			color: colours.green
		});

		return message.channel.send(embed);
	}
};