const colours = require('../../jsonFiles/colours.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
    config: {
        name: 'trivia',
        description: 'Answer questions on Military Warfare Tycoon.',
        usage: '.trivia',
        accessableby: 'Public',
        aliases: ['quiz']
    },
    run: async (bot, message, args) => {
        let questions = require('../../jsonFiles/trivia.json')

        let q = questions[Math.floor(Math.random() * questions.length)]
        let i = 0;
        let options = "";


        q.options.forEach(a => {
            i++;
            options += `**${i}. ${a}**\n`;
        })

        const Embed = new MessageEmbed()
            .setTitle('Trivia Question')
            .setDescription(`Question\n**${q.question}**\n\n${options}\nSubmit your answer with \`1-4\``)
            .setColor(colours.blurple)
            .setThumbnail(message.author.displayAvatarURL())
            .setFooter(`Trivia requested by: ${message.author.tag}`)
            .setTimestamp()

        message.channel.send(Embed)

        try {
            let msgs = await message.channel.awaitMessages(u2 => u2.author.id === message.author.id, { time: 20000, max: 1, errors: ["time"] })

            if (parseInt(msgs.first().content) == q.answer) {
                const correct = new MessageEmbed()
                    .setTitle(`Trivia Results`)
                    .setDescription(`You answered the trivia ||correctly, good job!||\n\n**Your Answer**\n\`${msgs.first().content}\``)
                    .setColor(colours.blurple)
                    .setThumbnail(message.author.displayAvatarURL())

                return message.channel.send(correct)

            } else {
                const incorrect = new MessageEmbed()
                    .setTitle(`Trivia Results`)
                    .setDescription(`You answered the trivia ||incorrectly, good try!||\n\n**Your Answer**\n\`${msgs.first().content}\``)
                    .setColor(colours.blurple)
                    .setThumbnail(message.author.displayAvatarURL())

                return message.channel.send(incorrect)
            }
        } catch (e) {
            return;
        }
    }
}