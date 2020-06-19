const { MessageEmbed } = require('discord.js');
const colours = require('../../jsonFiles/colours.json');

module.exports = {
	config: {
		name: 'test',
		description: 'Shows the server statistics.',
		usage: '.serverinfo',
		accessableby: 'Followers+',
		aliases: ['server', 'guild', 'guildinfo'],
		channel: 'story-corner',
		options: {
			name: '',
			cooldown: 1000,
			roles: {
				'Server Booster': 0.5,
				'Omega Follower': 0.5,
			},
		}
	},
	run: async (bot, message) => {

		const embed = new MessageEmbed()
			.setTitle('📌 Can\'t use this channel!')
			.setDescription(`The command  is limited to the channel. Try relocating to that channel and trying again!`)
			.setColor(colours.red);

		message.channel.send(embed);


	},
};