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
	async run({ message, args, argString, utils: { rblx, bloxlink } }) {
		const userManager = rblx.users;

		message.channel.startTyping();
		const userMentionMatch = args.user.match(/\d{17,19}/);
		if (userMentionMatch) {
			try {
				args.user = await bloxlink.resolve(userMentionMatch[0]);
			}
			catch(err) {
				if (err.data && err.data.error == 'This user is not linked with Bloxlink.') return message.channel.send(new MessageEmbed({
					title: 'User is not linked',
					description: 'User specified is not linked with bloxlink',
					color: colours.red
				}));
				console.error(err);
				return message.channel.send(new MessageEmbed({
					title: 'Failed to resolve roblox ID',
					description: 'Error occured from bloxlink, please try again later',
					color: colours.red
				}).setTimestamp());
			}
			if (!args.user) return message.channel.send(userNotFound);
		}
		else if (!argString.match(/^\d+$/)) {
			let users;
			try {
				users = await userManager.search({
					keyword: argString
				});
			}
			catch(err) {
				if (err.message == 'The keyword was filtered.') {
					return message.channel.send(embeds.keywordFiltered());
				}
				throw err;
			}

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
			fields: [
				{
					name: 'Blurb',
					value: fullData.description || 'None'
				},
				{
					name: 'Status',
					value: '`' + (userStatus || 'None') + '`'
				}
			],
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
