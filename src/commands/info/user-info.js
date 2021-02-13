const { Command } = require('discord-akairo');
const UserGuild = require('../../types/userGuild');
const SaikouEmbed = require('../../structure/SaikouEmbed');
const moment = require('moment');

class UserInfo extends Command {
	constructor() {
		super('user-info', {
			aliases: ['user-info', 'userinfo', 'user'],
			description: {
				usage: '[user]',
				content: ''
			},
			args: [{
				id: 'user',
				type: UserGuild(),
				default: message => message.author
			}]
		});
	}
	async exec(message, { user }) {
		let member;
		if (message.guild) member = message.guild.members.cache.get(user.id);

		const embed = new SaikouEmbed()
			.setAuthor(member ? member.displayName : user.username, user.displayAvatarURL({ format: 'png', dynamic: false, size: 64 }))
			.setDescription(user.toString())
			// .addBlankField()
			.setFooter(`User ID: ${user.id}`)
			.setThumbnail(user.displayAvatarURL({ format: 'png', dynamic: true, size: 512 }))
			.setTimestamp();

		// this is a bit confusing, but idk how to format it better
		if (member) embed.addField('Join Date', moment.utc(member.joinedAt).format('ll'), true)
		embed.addField('Register Date', moment.utc(user.createdAt).format('ll'), true);
		if (member) {
			embed.addField('Nickname', member.nickname || 'N/A', true)
			embed.addField('Status', member.presence.status, true);
		};
		embed.addField('User Tag', `#${user.discriminator}`, true)
			.addField('Bot', user.bot, true);
		if (member) {
			const roles = member.roles.cache.filter(r => r.id !== member.guild.id);
			embed.addBlankField().addField(`Roles [${roles.size}]`, roles.array().join(', '))
		};

		return message.util.send(embed);
	}
}
module.exports = UserInfo;