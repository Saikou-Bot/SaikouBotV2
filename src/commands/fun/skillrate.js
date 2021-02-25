const { Command } = require('discord-akairo');
const SaikouEmbed = require('../../structure/SaikouEmbed');
const UserGuild = require('../../types/userGuild');
const { getRandomInt } = require('../../util/Util')

class Skillrate extends Command {
	constructor() {
		super('skillrate', {
			aliases: ['skillrate', 'prorate', 'skill', 'pro', 'rate', 'rating'],
			args: [{
				id: 'user',
				type: UserGuild(),
				match: 'rest',
				default: msg => msg.author
			}]
		})
	}
	async exec(message, { user }) {
        
		if (getRandomInt(0, 100) < 98) {
        return message.util.send(new SaikouEmbed()
            .setTitle('Skill Rating')
			.setDescription(`**${user.username}** is \`%${getRandomInt(0, 100)}\` skilled! 🏆`)
			.setColor('RANDOM')
			);
        }
		else {
			return message.util.send(new SaikouEmbed()
			.setTitle('Skill Rating 🔥')
			.setDescription(`**${user.username}** is 𝐁𝐄𝐘𝐎𝐍𝐃 𝐆𝐎𝐃𝐋𝐈𝐊𝐄! 🏆`)
			.setColor('RED'))
		}

    }
}
module.exports = Skillrate;