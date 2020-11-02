const questions = require('../../data/trivia.json');

module.exports = {
	config: {
		name: 'trivia',
		description: 'Answer questions based off Military Warfare Tycoon, how good is your knowledge?',
		usage: '.trivia',
		accessableby: 'Followers+',
		aliases: ['quiz'],
		channel: 'bot-commands'
	},
	run: async ({ client: bot, message, utils: { shorten } }) => {

		const question = questions[Math.floor((Math.random() * questions.length))];
		const options = question.options.map((a, i) => `**${i + 1}. ${a}**`).join('\n');

		message.channel.send(new MessageEmbed()
			.setTitle('Trivia Question')
			.setDescription(`Question\n**${question.question}**\n\n${options}\nSubmit your answer with \`1-4\``)
			.setColor(message.member.displayHexColor)
			.setThumbnail(message.author.displayAvatarURL())
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
			.setTimestamp());

		let msgs;

		try {
			msgs = await message.channel.awaitMessages(m => m.author.id === message.author.id, { time: 20000, max: 1, errors: ['time'] });
		}
		catch (err) {
			return message.channel.send(new MessageEmbed()
				.setTitle('⏱ Out of time!')
				.setDescription('You ran out of time to answer the Trivia!')
				.setColor(message.member.displayHexColor)
				.setThumbnail(message.author.displayAvatarURL()));
		}

		const response = msgs.first();

		if (response.content == question.answer)
			return message.channel.send(new MessageEmbed()
				.setTitle('Trivia Results')
				.setDescription(`You answered the trivia ||correctly, good job!||\n\n**Your Answer**\n\`${response.content}\``)
				.setColor(message.member.displayHexColor)
				.setThumbnail(message.author.displayAvatarURL()));

		else
			return message.channel.send(new MessageEmbed()
				.setTitle('Trivia Results')
				.setDescription(`You answered the trivia ||incorrectly, good try!||\n\n**Your Answer**\n\`${shorten(response.content, 500)}\``)
				.setColor(message.member.displayHexColor)
				.setThumbnail(message.author.displayAvatarURL()));

	},
};
