const { Argument } = require('discord-akairo');
const Util = require('../util/Util');

module.exports = (caseSensitive = false, wholeWord = false) => async function typeFn(message, phrase) {
	if (!phrase) return null;

	// console.log(message.guild);
	if (message.guild) return Util.resolveMember(phrase, message.guild.members.cache, caseSensitive, wholeWord);
	else {
		// const mutualGuilds = Util.mutualGuilds(this.client, this.client.guilds.cache, phrase) // won't work, becuase it only looks for a already found user's mutual guilds
		// const mutualGuilds = new Collection();

		// for (guild in guilds) {
		// 	const member = Util.resolveMember(phrase, guild.members.cache, caseSensitive, wholeWord);
		// 	// member should always defined, but just checking
		// 	if (member) mutualGuilds.set(guild.id, guild);
		// };

		// let guild;
		// if (mutualGuilds.size === 1) guild = mutualGuilds.first();
		// else (mutualGuilds.size > 0) guild = mutualGuilds.sort((a, b) => b.memberCount - a.memberCount).first();

		// return guild ? Util.resolveMember()
		const user = Util.resolveUser(phrase, message.client.users.cache);
		// if (!user) return null;
		// const mutualGuilds = Util.mutualGuilds(this.client.guilds.cache, user);
		// const bestGuild = Util.bestGuild(mutualGuilds, user);

		// return bestGuild.members.resolve(user) || null;
	
		return Util.resolveMutualMember(user, message.client.guilds.cache, caseSensitive, wholeWord);
	}
};