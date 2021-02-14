const reg = /^(?:<@!?)?(\d{17,19})(?:>)?$/;

module.exports = (caseSensitive = false, wholeWord = false) => function typeFn(message, phrase) {
	const users = message.client.users.cache;

	const match = phrase.match(reg);
	if (match) {
		const user = users.get(match[1]);
		if (user) return user;
	}

	return users.find(user => this.checkUser(text, user, caseSensitive, wholeWord));
}

function checkUser(text, user, caseSensitive = false, wholeWord = false) {
	text = caseSensitive ? text : text.toLowerCase();
	const username = caseSensitive ? user.username : user.username.toLowerCase();
	const discrim = user.discriminator;

	if (!wholeWord) {
		return username.includes(text) ||
			(username.includes(text.split('#')[0]) && discrim.includes(text.split('#')[1]));
	}

	return username === text ||
		(username === text.split('#')[0] && discrim === text.split('#')[1]);
}