const { MENTION_REG } = require('../util/Constants');
const Util = require('../util/Util');

module.exports = (caseSensitive = false, wholeWord = false) => async function(message, phrase) {
	if (!phrase) return null;
	if (!message.guild) return Util.resolveUser(phrase, message.client.users.cache);
	const members = message.guild.members.cache;

	const match = phrase.match(MENTION_REG);
	if (match) {
		const member = members.get(match[1]);
		if (member) member.user;
	}
	let member = message.guild.members.cache.find(member => Util.checkMember(phrase, member));
	if (member) return member.user;		
	else return null;
}