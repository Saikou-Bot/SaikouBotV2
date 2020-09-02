const facts = require('../../jsonFiles/mwtfact.json');


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
	run: async ({ client: bot, message }) => {

		const pickedFact = Math.floor((Math.random() * facts.length));

		const mwtfactEmbed = new MessageEmbed()
			.setTitle('MWT Fact')
			.setDescription(facts[pickedFact])
			.setColor(colours.blurple)
			.setFooter(`Requested by: ${message.author.username}`, message.author.displayAvatarURL());

		message.channel.send(mwtfactEmbed);


	},
};
