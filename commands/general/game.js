/* eslint-disable no-undef */
module.exports = {
	config: {
		name: 'game',
		description: 'Reserved for the staff team to create a game moderation log embed.',
		usage: '.game <user>, <punishment>, <reason>',
		accessableby: 'Staff',
		aliases: ['gamelog'],
		channel: 'moderation',
		cooldown: true,
		autoCooldown: true,
	},
	run: async ({ client: bot, message, args }) => {

		const name = args.join(' ').split(', ')[0];
		const punishment = args.join(' ').split(', ')[1];
		const reason = args.join(' ').split(', ')[2];

		message.delete();
		if (!name || !punishment || !reason)
			return message.channel.send(new MessageEmbed()
				.setTitle('📋 Incorrect Usage')
				.setDescription('**Command Name:** moderation\n**Usage:** `game <user>, <punishment>, <reason>')
				.setColor(colours.red)
				.setFooter('<> - Required ● Optional - [] ')).then(m => m.delete({ timeout: 12000 }));


		moderation.send(new MessageEmbed()
			.setAuthor(`MWT | ${punishment}`, bot.user.displayAvatarURL())
			.addField('User:', `${name}`, true)
			.addField('Moderator:', `<@${message.author.id}>`, true)
			.addField('Reason:', `${reason}`)
			.setThumbnail(bot.user.displayAvatarURL())
			.setColor(colours.green)
			.setFooter(`${punishment}`)
			.setTimestamp());
	}
};
