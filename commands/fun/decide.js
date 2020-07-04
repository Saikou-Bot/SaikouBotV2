module.exports = {
	config: {
		name: 'decide',
		description: 'Struggling to decide between two things? Let Saikou decide for you!',
		usage: '.decide <decision1> | <decision2>',
		accessableby: 'Followers+',
		aliases: ['saikouDecide'],
		channel: 'bot-commands'
	},
	run: async ({ client: bot, message, args }) => {


		const args1 = args.join(' ').split('| ')[0];
		const args2 = args.join(' ').split('| ')[1];

		if (!args1 || !args2) {
			return message.channel.send(new MessageEmbed()
				.setTitle('📋 Incorrect Usage')
				.setDescription('**Command Name:** decide\n**Usage:** `decide <option1> | <option2>')
				.setColor(colours.red)
				.setFooter('<> - Required ● Optional - [] '));
		}


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
