const { Command } = require('discord-akairo');
const SaikouEmbed = require('../../structure/SaikouEmbed');

class Decide extends Command {
	constructor() {
		super('decide', {
			aliases: ['decide', 'choose', 'pick'],
            separator: '|',
            args: [
                {
                    id: 'choice',
                    type: 'string',
                    match: 'separate'
                }
            ]
		})
	}
	async exec(message, args) {

        const options = args.choice.map((choice) => {
             return `• ${choice}`
         })

        return message.util.send(new SaikouEmbed()
                .setTitle('📝 Decide Results')
				.setDescription(`Hmmm... that's a tough one, I choose **${args.choice[Math.floor(Math.random() * args.choice.length)]}**`)
                .addField('Options', options)
                .setColor('RANDOM')
        )


    }
}
module.exports = Decide;