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
        .setTitle('ℹ MWT Fact')
        .setDescription(`**Fact:** ${choose(MWT_FACTS)}`)
        .setThumbnail('https://t7.rbxcdn.com/da559f4079c9173b45639f278d683846')
        .setColor('BLURPLE')
        .setFooter(`Requested by: ${message.author.username}`, message.author.displayAvatarURL())
        )
    }
}
module.exports = MWTfact;