const splitReg = /\s*\|\s*/;

const responses = [
	'That\'s a hard one... I choose',
	'Hm... I choose',
	'Hmmm... That\'s a tough one. I choose',
	'Let\'s go with'
];

module.exports = {
	config: {
		name: 'decide',
		description: 'Struggling to decide between two things? Let Saikou decide for you!',
		usage: '.decide <decision1> | <decision2>',
		accessableby: 'Followers+',
		aliases: ['saikouDecide'],
		channel: 'bot-commands',
		cooldown: true,
		autoCooldown: true,
	},
	async run ({ client, message, args, argString, utils: { shorten } }) {

		const options = argString.split(splitReg).filter(v => new Boolean(v));
		if (options.length < 1) return message.channel.send(new MessageEmbed()
				.setTitle('📋 Incorrect Usage')
				.setDescription('**Command Name:** decide\n**Usage:** `decide <option1> | <option2>')
				.setColor(colours.red)
				.setFooter('<> - Required ● Optional - [] ')); 

		// TODO: embed
		if (options.length > 10) return message.channel.send(new MessageEmbed()
				.setTitle('📋 Incorrect Usage')
				.setDescription('Max 10 options')
				.setColor(colour.red));


		const response = responses[Math.floor((Math.random() * responses.length))];

		const maxLength = 500 / options.length;

		return message.channel.send(new MessageEmbed()
				.setTitle('📝 Decide Results')
				.setDescription(`${response} **${options[Math.floor(Math.random() * options.length)]}**`)
				.addField('Options', options.map(o => `• ${shorten(o, maxLength)}`).join('\n'))
				.setColor(message.member.displayHexColor));
	},
};
