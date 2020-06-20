const { MessageEmbed } = require('discord.js');

module.exports = {
	config: {
		name: 'decide',
		description: 'Struggling to decide between two things? Let Saikou decide for you!',
		usage: '.decide <decision1> | <decision2>',
		accessableby: 'Followers+',
		aliases: ['saikouDecide'],
		arguments: {
			'option1': true,
			'option2': true,
		},
		channel: 'bot-commands'
	},
	run: async (bot, message, args) => {


		const args1 = Object.values(args)[0];
		const args2 = Object.values(args)[1];


		const responses = [
			'That\'s a hard one... I choose',
			'Hm... I choose',
			'Hmmm... That\'s a tough one. I choose',
			'Let\'s go with'
		];
		const result = Math.floor((Math.random() * responses.length));


		const index = Math.random();
		if (index < 0.5) {
			const embed = new MessageEmbed()
				.setTitle('📝 Decide Results')
				.setDescription(`${responses[result]} **${args1}**`)
				.addField('Options', `• ${args1}\n• ${args2}`)
				.setColor(message.member.displayHexColor);

			return message.channel.send(embed);
		}
		else {
			const embed = new MessageEmbed()
				.setTitle('📝 Decide Results')
				.setDescription(`${responses[result]} **${args2}**`)
				.addField('Options', `• ${args1}\n• ${args2}`)
				.setColor(message.member.displayHexColor);

			return message.channel.send(embed);
		}

	},
};