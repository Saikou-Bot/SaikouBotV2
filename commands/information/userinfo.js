const moment = require('moment');

module.exports = {
	config: {
		name: 'userinfo',
		description: 'Shows a whole bunch of user information.',
		usage: '.userinfo || .userinfo <user>',
		accessableby: 'Followers+',
		aliases: ['user', 'whois'],
		channel: 'bot-commands'
	},
	run: async ({ client: bot, message, args, utils: { getMember } }) => {

		const member = getMember(message, args.join(' '));

		const info = new MessageEmbed()
			.setAuthor(member.displayName, member.user.displayAvatarURL())
			.setThumbnail(member.user.displayAvatarURL())
			.setDescription(`<@${member.id}>`)
			.addField('Join Date', moment.utc(member.joinedAt).format('ll'), true)
			.addField('Register Date', moment.utc(member.user.createdAt).format('ll'), true)
			.addField('Nickname', member.nickname !== undefined && member.nickname !== null ? member.nickname : 'No Nickname', true)
			.addField('Status', member.presence.status, true)
			.addField('User Tag', `#${member.user.discriminator}`, true)
			.addField('Bot', member.user.bot, true)
			.addField(`Roles [${member.roles.cache.size - 1}]`, member.roles.cache.filter(r => r.id !== message.guild.id).map(r => r).join(', ') || 'No roles')
			.setColor(colours.blurple)
			.setFooter(`User ID: ${member.id}`)
			.setTimestamp();


		message.channel.send(info);


	},
};
