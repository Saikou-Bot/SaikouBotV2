const { Command } = require('discord-akairo');
const SaikouEmbed = require('../../structure/SaikouEmbed');
const { choose } = require('../../util/Util');
const { MWT_FACTS } = require('../../util/Constants');

class MWTfact extends Command {
	constructor() {
		super('mwtfact', {
			aliases: ['mwtfact', 'gamefact'],
		})
	}
	async exec(message) {

        return message.util.send(new SaikouEmbed()
        .setTitle('MWT Fact')
        .setDescription(`**Fact:** ${choose(MWT_FACTS)}`)
        .setColor('BLURPLE')
        .setFooter(`Requested by: ${message.author.username}`, message.author.displayAvatarURL())
        )
    }
}
module.exports = MWTfact;