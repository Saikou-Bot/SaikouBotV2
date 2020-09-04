function getMember(message, toFind = '') {
	toFind = toFind.toLowerCase();

	const userIDMatch = toFind.match(/\d{17,19}/);

	if (userIDMatch) {
		let target = message.guild.members.cache.get(userIDMatch[0]);
		if (target && !target.user.bot) return target;
	}

	if (toFind) {
		let target = message.guild.members.cache.find(member => {
			return member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind);
		});
		if (!target.user.bot) return target;
	}

	return member.member
}

module.exports = {
	name: 'getMember',
	construct(client) {
		return getMember;
	}
};
