const { Argument } = require('discord-akairo');
const Util = require('../util/Util');

module.exports = (caseSensitive = false, wholeWord = false) => async function typeFn(message, phrase) {
	if (!phrase) return null;

	if (message.guild) return Util.resolveMember(phrase, message.guild.members.cache, caseSensitive, wholeWord);
	else {
		// const mutualGuilds = Util.mutualGuilds(this.client, this.client.guilds.cache, phrase) // won't work, becuase it only looks for a already found user's mutual guilds
		const mutualGuilds = new Collection();

		for (guild in guilds) {
			const member = Util.resolveMember(phrase, guild.members.cache, caseSensitive, wholeWord);
			// member should always defined, but just checking
			if (member) mutualGuilds.set(guild.id, guild);
		};
		return mutualGuilds;
	}
};