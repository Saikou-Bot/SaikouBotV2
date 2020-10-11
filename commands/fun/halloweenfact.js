const facts = require('../../jsonFiles/halloween.json');

module.exports = {
	config: {
		name: 'halloweenfact',
		description: 'Looking to know some things about Halloween? Look no further...',
		usage: '.halloweenfact',
		accessableby: 'Followers+',
		aliases: ['halfact'],
		channel: 'bot-commands',
		cooldown: true,
		autoCooldown: true,
	},
	run: async ({ client: bot, message }) => {

		const pickedFact = Math.floor((Math.random() * facts.length));

		const mwtfactEmbed = new MessageEmbed()
			.setTitle('Halloween Fact 🎃')
			.setDescription(facts[pickedFact])
			.setColor(colours.orange)
			.setFooter(`Requested by: ${message.author.username}`, message.author.displayAvatarURL());

		message.channel.send(mwtfactEmbed);
	},
};
