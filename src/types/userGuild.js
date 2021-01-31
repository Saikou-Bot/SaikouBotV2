const reg = /(<@|^)!?(\d{17,19})(>|$)/;

module.exports = (caseSensitive = false, wholeWord = false) => async function(message, phrase) {
	if (!phrase) return null;

	const match = phrase.match(reg);
	if (match) {
		try {
			return await this.client.users.fetch(match[0]);
		} catch (err) {}
	}
	let member = message.guild.members.cache.find(member => checkMember(phrase, member));
	if (member) return member.user;
	else return null;
}

function checkMember(text, member, caseSensitive, wholeWord) {
	text = caseSensitive ? text : text.toLowerCase();
	const username = caseSensitive ? member.user.username : member.user.username.toLowerCase();
	const displayName = caseSensitive ? member.displayName : member.displayName.toLowerCase();
	const discrim = member.user.discriminator;

	if (!wholeWord) {
		return displayName.includes(text) ||
			username.includes(text) ||
			((username.includes(text.split('#')[0]) || displayName.includes(text.split('#')[0])) && discrim.includes(text.split('#')[1]));
	}

	return displayName === text ||
		username === text ||
		((username === text.split('#')[0] || displayName === text.split('#')[0]) && discrim === text.split('#')[1]);
}