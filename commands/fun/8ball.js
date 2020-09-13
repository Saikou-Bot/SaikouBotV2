module.exports = {
	config: {
		name: '8ball',
		description: 'Ask any question you desire and have it answered by the 8ball.',
		usage: '.8ball <question>',
		accessableby: 'Followers+',
		aliases: ['question'],
		channel: 'bot-commands',
		cooldown: true,
		autoCooldown: true,
	},
	run: async ({ client: bot, message, args }) => {

		const replies = [
			'It is certain',
			'It is decidedly so',
			'Without a doubt',
			'Yes - definitely',
			'You may rely on it',
			'As I see it, yes',
			'Most likely',
			'Outlook good',
			'Yes',
			'Signs point to yes',
			'Reply hazy, try again',
			'Ask again later',
			'Better to not tell you now',
			'Cannot predict now',
			'Don\'t count on it',
			'My reply is no',
			'My sources say no',
			'Outlook not so good',
			'Very doubtful',
			'Certainly not',
		];

		const result = Math.floor((Math.random() * replies.length));
		const question = args.join(' ');
		const questionShortener = question.length > 1900 ? question.substring(0, 1800) + '...' : question;

		const Usage = new MessageEmbed()
			.setTitle('✍️ No question asked!')
			.setDescription('Please ask a question for the 8ball to answer.')
			.setFooter('Input question')
			.setTimestamp()
			.setColor(colours.red);

		if (!args[1]) return message.channel.send(Usage);

		const words = new MessageEmbed()
			.setTitle('📜 Not enough words!')
			.setDescription('Your question must contain at least **10** or more letters before being able to have it answered.')
			.setColor(colours.red)
			.setFooter('Incorrect word amount')
			.setTimestamp();

		if (question.length < 10) return message.channel.send(words);

		const ballembed = new MessageEmbed()
			.setTitle(':8ball: 8ball Results')
			.setDescription(`Question\n**${questionShortener}**\n\n8ball Answer\n**${replies[result]}**`)
			.setThumbnail(message.author.displayAvatarURL())
			.setFooter(`Asked by ${message.author.tag}`, message.author.displayAvatarURL())
			.setTimestamp()
			.setColor(colours.blurple);


		message.channel.send(ballembed);


	},
};
