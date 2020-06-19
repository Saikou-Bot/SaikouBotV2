const { MessageEmbed } = require('discord.js');
const { getMember } = require('../../commands/utils/getMember');
const colours = require('../../jsonFiles/colours.json');

module.exports = {
	config: {
		name: 'avatar',
		description: 'Gives a picture of a users avatar.',
		usage: '.avatar || .avatar <user>',
		accessableby: 'Followers+',
		aliases: ['pp', 'profilepic'],
	},
	run: async (bot, message, args) => {

		const member = getMember(message, args[0]);

		const avatarEmbed = new MessageEmbed()
			.setTitle(`${member.displayName}'s avatar`)
			.setColor(colours.blurple)
			.setImage(member.user.displayAvatarURL({ size: 4096, dynamic: true }));


		message.channel.send(avatarEmbed);


	},
};