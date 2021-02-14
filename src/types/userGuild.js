const { MENTION_REG } = require('../util/Constants');
const { getMember } = require('../util/Util');

module.exports = (caseSensitive = false, wholeWord = false) => async function(message, phrase) {
	if (!phrase) return null;

	const members = message.guild ? message.guild.members.cache : message.client.members.cache;

	const match = phrase.match(MENTION_REG);
	if (match) {
		const member = members.get(match[1]);
		if (member) member.user;
	}
	let member = message.guild.members.cache.find(member => checkMember(phrase, member));
	if (member) return member.user;		
	else return null;
}