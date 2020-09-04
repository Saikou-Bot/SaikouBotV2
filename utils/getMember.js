function getMember(message, toFind = '') {
	toFind = toFind.toLowerCase();

	const userIDMatch = toFind.match(/\d{17,19}/);

	if (userIDMatch) {
		const target = message.guild.members.cache.get(userIDMatch[0]);
		if (target && !target.user.bot) return target;
	}

	if (toFind) {
		const target = message.guild.members.cache.find(member => {
			return member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind);
		});
		if (target && !target.user.bot) return target;
	}

	return message.member;
}

module.exports = {
	name: 'getMember',
	construct(client) {
		return getMember;
	}
};
