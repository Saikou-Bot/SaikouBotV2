module.exports = {
	config: {
		name: 'avatar',
		description: 'Gives a picture of a users avatar.',
		usage: '.avatar || .avatar <user>',
		accessableby: 'Followers+',
		aliases: ['pp', 'profilepic'],
		channel: 'bot-commands'
	},
	run: async ({ client: bot, message, args, utils: { getMember } }) => {

		const member = getMember(message, args[0]);

		const avatarEmbed = new MessageEmbed()
			.setTitle(`${member.displayName}'s avatar`)
			.setColor(colours.blurple)
			.setImage(member.user.displayAvatarURL({ size: 4096, dynamic: true }));


		message.channel.send(avatarEmbed);
	},
};
