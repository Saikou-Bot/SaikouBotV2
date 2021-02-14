const { MENTION_REG } = require('../util/Constants');
const { resolveMember } = require('../util/Util');

module.exports = (caseSensitive = false, wholeWord = false) => function typeFn(message, phrase) {
	if (!phrase) return null;

	return resolveMember(phrase, message.guild.members.cache, caseSensitive, wholeWord);
}