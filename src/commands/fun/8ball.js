const { Command } = require('discord-akairo');
const SaikouEmbed = require('../../structure/SaikouEmbed');
const { EIGHTBALL_REPLIES } = require('../../util/Constants');
const { Argument } = require('discord-akairo');
const shorten = require('../../types/shorten');
const { choose } = require('../../util/Util');

// console.log(shorten(150));

class EightBall extends Command {
	constructor() {
		super('8ball', {
			aliases: ['8ball', '8b'],
			description: {

			},
			args: [{
				id: 'question',
				type: Argument.compose('string', shorten(150)),
				// type: 'string',
				match: 'rest'
			}]
		});
	}
	async exec(message, { question }) {
		const reply = choose(EIGHTBALL_REPLIES);

		const embed = new SaikouEmbed()
			.setTitle('🎱 8ball Results')
			.setDescription(`Question\n**${question}**\n\n8ball Answer\n**${reply}**`)
			.setThumbnail(message.author.displayAvatarURL({ size: 512, dynamic: true }))
			.setFooter(`Asked by ${message.author.tag}`, message.author.displayAvatarURL({ size: 64 }))
			.setTimestamp();

		return message.util.send(embed);
	}
}
module.exports = EightBall;