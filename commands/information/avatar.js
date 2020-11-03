module.exports = {
	config: {
		name: 'avatar',
		description: 'Gives a picture of a users avatar.',
		usage: '.avatar || .avatar <user>',
		accessableby: 'Followers+',
		aliases: ['pp', 'profilepic'],
		channel: 'bot-commands'
	},
	async run({ message, argString, utils: { getMember } }) {
		const member = await getMember(message, argString);

		const avatarEmbed = new MessageEmbed()
			.setAuthor(`${member.user.tag}`, member.user.displayAvatarURL())
			.setTitle('Avatar')
			.setDescription(`<@${member.user.id}>`)
			.setColor(colours.blurple)
			.setImage(member.user.displayAvatarURL({ size: 4096, dynamic: true }));


		message.channel.send(avatarEmbed);
	},
};
