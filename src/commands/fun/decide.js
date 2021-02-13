const { Command } = require('discord-akairo');
const SaikouEmbed = require('../../structure/SaikouEmbed');
const { choose } = require('../../util/Util');

class Decide extends Command {
	constructor() {
		super('decide', {
			aliases: ['decide', 'choose', 'pick'],
            separator: '|',
            args: [
                {
                    id: 'choice',
                    type: 'string',
                    match: 'separate',
                    otherwise: 'Please provide options' // needs improving, maybe auto usage
                }
            ]
		})
	}
	async exec(message, { choice }) {
        const options = choice.map(choice => `• ${choice}`);

        return message.util.send(new SaikouEmbed()
                .setTitle('📝 Decide Results')
				.setDescription(`Hmmm... that's a tough one, I choose **${choose(choice)}**`)
                .addField('Options', options)
                .setColor('RANDOM')
        );
    }
}
module.exports = Decide;