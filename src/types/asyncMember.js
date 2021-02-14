const { MENTION_REG } = require('../util/Constants');
const { getMember } = require('../util/Util');

module.exports = (caseSensitive = false, wholeWord = false) => async function typeFn(message, phrase) {
	if (!phrase) return null;

	const memberManager = message.guild.members;
	const members = memberManager.cache;

	const match = phrase.match(MENTION_REG);
	try {
		return await memberManager.fetch(match[1]);
	}
	catch(err) {
		if (err && err.httpStatus !== 404) throw err;
	}

	return members.find(member => checkMember(text, member, caseSensitive, wholeWord));
}