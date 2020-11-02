const missions = require('../../data/mission.json');

module.exports = {
	config: {
		name: 'mission',
		description: 'Gives you a mission you can do in Military Warfare Tycoon if you are running out of ideas!',
		usage: '.mission',
		accessableby: 'Followers+',
		aliases: ['mwtmission'],
		channel: 'bot-commands',
		cooldown: true,
		autoCooldown: true,
	},
	run: async ({ message }) => {

		message.channel.send(new MessageEmbed()
			.setTitle('Here\'s your mission Soldier...')
			.setDescription(missions[Math.floor((Math.random() * missions.length))])
			.setColor(message.member.displayHexColor)
			.setThumbnail(message.author.displayAvatarURL())
			.setFooter('Your mission')
			.setTimestamp());
	},
};