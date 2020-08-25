module.exports = async (client, messageReaction, user) => {
	client.utils.suggestions.reactionChange(messageReaction, user);
}