const { Command } = require('discord-akairo');
const SaikouEmbed = require('../../structure/SaikouEmbed');
const UserGuild = require('../../types/userGuild');

class Avatar extends Command {
	constructor() {
		super('avatar', {
			aliases: ['avatar', 'pfp'],
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
		// console.log(args);
		// console.log(user);

		const embed = new SaikouEmbed()
			.setAuthor(user.tag, user.displayAvatarURL({ size: 64 }))
			.setTitle('Avatar')
			.setDescription(user.toString())
			.setImage(user.displayAvatarURL({ format: 'png', size: 512 }));

		return message.util.send(embed);
	}
}
module.exports = Avatar;