const { MENTION_REG } = require('../util/Constants');
const { getUser } = require('../util/Util');

module.exports = (caseSensitive = false, wholeWord = false) => async function typeFn(message, phrase) {
	const userManager = message.client.users;
	const users = userManager.cache;

	const match = phrase.match(userReg);
	if (match) {
		try {
			return await userManager.fetch(match[1]);
		}
		catch(err) {
			if (err && err.httpStatus !== 404) throw err;
		}
	}

	return users.find(user => checkUser(text, user, caseSensitive, wholeWord));
}