class SuggestionManager {
	constructor(client, options = {}) {
		options = Object.assign({}, {
			upvote: '⬆️',
			downvote: '⬇️',
			maxvote: 15,
			suggestionChannel: 'suggestions',
			featuredChannel: 'featured-suggestions'
		}, options);
		this.suggestionChannel = options.suggestionChannel;
		this.featuredChannel = options.featuredChannel;
		this.emojis = {
			upvote: options.upvote,
			downvote: options.downvote
		}
		this.maxvote = options.maxvote;
		this.client = client;
	}
	async reactionChange(messageReaction, user) {
		if (!messageReaction.message.channel.name.match(this.suggestionChannel)) return;
		const { message } = messageReaction;

		if (messageReaction.partial) {
			try {
				await messageReaction.fetch();
			}
			catch(err) {}
		}

		if (message.author.id != this.client.user.id || (!Object.values(this.emojis).includes(messageReaction.emoji.name))) return;

		const suggestion = await this.client.databases.suggestion.findOne({ channelID: message.channel.id, messageID: message.id });
		
		if (!suggestion) return;

		const upvote = message.reactions.cache.get(this.emojis.upvote);
		const downvote = message.reactions.cache.get(this.emojis.downvote);

		const upvoteCount = upvote ? upvote.count : 0;
		const downvoteCount = downvote ? downvote.count : 0;

		const votes = upvoteCount - downvoteCount;

		if (votes >= this.maxvote) {
			const featuredChannel = message.guild.channels.cache.find(c => c.name.match(this.featuredChannel));
			if (!featuredChannel) return;

			featuredChannel.send(message.embeds[0]).catch(() => {});
		}
	}
}

module.exports = {
	name: 'suggestions',
	construct(client) {
		return new SuggestionManager(client, {
			maxvote: 1
		});
	}
}