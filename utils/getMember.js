async function getMember(message, content) {
	content = (content || message.content).toLowerCase();

	const userIDMatch = content.match(/\d{17,19}/);

	if (content) {
		if (userIDMatch) {
			let member;
			try {
				member = await message.guild.members.fetch(userIDMatch[0]);
			}
			catch(err) {
				if (err.httpStatus != 404) throw err;
			}
			if (member && !member.user.bot) return member;
		}
		const member = message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(content) || m.user.username.toLowerCase().includes(content));
		if (member && !member.user.bot) return member;
	}
	return message.member;
}

module.exports = {
	name: 'getMember',
	construct(client) {
		return getMember;
	},
	getMember
};
