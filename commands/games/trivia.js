const { MessageEmbed } = require('discord.js');

module.exports = {
	config: {
		name: 'trivia',
		description: 'Answer questions based off Military Warfare Tycoon, how good is your knowledge?',
		usage: '.trivia',
		accessableby: 'Followers+',
		aliases: ['quiz'],
		channel: 'bot-commands'
	},
	run: async ({ client: bot, message }) => {
		const questions = require('../../jsonFiles/trivia.json');

		const q = questions[Math.floor((Math.random() * questions.length))];
		let i = 0;
		let options = '';


		q.options.forEach(a => {
			i++;
			options += `**${i}. ${a}**\n`;
		});

		const Embed = new MessageEmbed()
			.setTitle('Trivia Question')
			.setDescription(`Question\n**${q.question}**\n\n${options}\nSubmit your answer with \`1-4\``)
			.setColor(message.member.displayHexColor)
			.setThumbnail(message.author.displayAvatarURL())
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
			.setTimestamp();

		message.channel.send(Embed);

		try {
			const msgs = await message.channel.awaitMessages(u2 => u2.author.id === message.author.id, { time: 20000, max: 1, errors: ['time'] });

			if (parseInt(msgs.first().content) == q.answer) {
				const correct = new MessageEmbed()
					.setTitle('Trivia Results')
					.setDescription(`You answered the trivia ||correctly, good job!||\n\n**Your Answer**\n\`${msgs.first().content}\``)
					.setColor(message.member.displayHexColor)
					.setThumbnail(message.author.displayAvatarURL());

				return message.channel.send(correct);

			}
			else {
				const incorrect = new MessageEmbed()
					.setTitle('Trivia Results')
					.setDescription(`You answered the trivia ||incorrectly, good try!||\n\n**Your Answer**\n\`${msgs.first().content}\``)
					.setColor(message.member.displayHexColor)
					.setThumbnail(message.author.displayAvatarURL());

				return message.channel.send(incorrect);
			}
		}
		catch (e) {
			const notime = new MessageEmbed()
				.setTitle('⏱ Out of time!')
				.setDescription('You ran out of time to answer the Trivia!')
				.setColor(message.member.displayHexColor)
				.setThumbnail(message.author.displayAvatarURL());

			return message.channel.send(notime);
		}
	},
};
