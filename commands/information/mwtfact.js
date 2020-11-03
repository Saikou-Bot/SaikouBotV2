const facts = require('../../data/mwtfact.json');

module.exports = {
	config: {
		name: 'mwtfact',
		description: 'Fuel your knowledge with over 20 Military Warfare Tycoon facts.',
		usage: '.mwtfact',
		accessableby: 'Followers+',
		aliases: ['factsmwt'],
		channel: 'bot-commands',
		cooldown: true,
		autoCooldown: true,
	},
	async run ({ message }) {
		return message.channel.send(new MessageEmbed()
			.setTitle('MWT Fact')
			.setDescription(facts[Math.floor((Math.random() * facts.length))])
			.setColor(colours.blurple)
			.setFooter(`Requested by: ${message.author.username}`, message.author.displayAvatarURL()));
	},
};
