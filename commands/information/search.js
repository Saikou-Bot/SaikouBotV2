const userNotFound = new MessageEmbed({
	title: 'User not found',
	description: 'The user was not found',
	color: colours.red
});

module.exports = {
	config: {
		name: 'search',
		cooldown: true,
		arguments: {
			user: true
		}
	},
	async run({ message, args, argString, utils: { rblx } }) {
		const userManager = rblx.users;

		message.channel.startTyping();

		if (!argString.match(/^\d+$/)) {
			const users = await userManager.search({
				keyword: argString
			});

			if (users.length < 1) return message.channel.send(userNotFound);
			args.user = users[0].id;
		}

		let fullData, userStatus, userHeadshot, userAvatar;

		try {
			const response = await Promise.all([
				userManager.fetch(args.user),
				userManager.getStatus(args.user),
				userManager.headshot(args.user),
				userManager.avatar(args.user, {
					size: '250x250',
					format: 'Png'
				})
			]);
			fullData = response[0];
			userStatus = response[1];
			userHeadshot = response[2];
			userAvatar = response[3];
		}
		catch(err) {
			return message.channel.send(userNotFound);
		}

		message.channel.stopTyping();

		const embed = new MessageEmbed({
			author: {
				name: fullData.displayName,
				url: `https://www.roblox.com/users/${fullData.id}/profile`,
				iconURL: userHeadshot
			},
			description: fullData.description,
			fields: {
				name: 'Blob',
				value: '`' + userStatus + '`'
			},
			footer: {
				text: `User ID • ${args.user} | User Created`
			},
			thumbnail: {
				url: userAvatar.state == 'Completed' ? userAvatar.imageUrl : undefined
			},
			color: fullData.isBanned ? colours.orange : colours.green,
			timestamp: new Date(fullData.created)
		});
		message.channel.send(embed);
	}
};
