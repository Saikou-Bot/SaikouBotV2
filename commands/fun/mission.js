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
	run: async ({ client: bot, message }) => {

		const missions = require('../../jsonFiles/mission.json');
		const pickedMission = Math.floor((Math.random() * missions.length));

		const MissionEmbed = new MessageEmbed()
			.setTitle('Here\'s your mission Soldier...')
			.setDescription(missions[pickedMission])
			.setColor(message.member.displayHexColor)
			.setTimestamp()
			.setFooter('Your mission')
			.setThumbnail(message.author.displayAvatarURL());

		message.channel.send(MissionEmbed);
	},
};