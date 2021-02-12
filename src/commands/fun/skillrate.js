const { Command } = require('discord-akairo');
const SaikouEmbed = require('../../structure/SaikouEmbed');
const UserGuild = require('../../types/userGuild');

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
	async exec(message, args) {
		const { user } = args;

        if (Math.random() * 100 < 98) {
        return message.util.send(new SaikouEmbed()
            .setTitle('Skill Rating')
			.setDescription(`**${user.username}** is \`%${Math.floor(Math.random() * 101)}\` skilled! 🏆`)
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