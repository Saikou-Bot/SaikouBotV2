const infoReg = /,\s*/;

module.exports = {
	config: {
		name: 'group',
		description: 'Reserved for the staff team to create a moderation log embed.',
		usage: '.group <user>, <punishment>, <reason>',
		accessableby: 'Staff',
		aliases: ['grouplog', 'embed'],
		channel: 'moderation',
		cooldown: true,
		autoCooldown: true,
	},
	run: async ({ client, message, argString }) => {
		message.delete().catch(() => {});

		const info = argString.split(infoReg);

		if (info.length < 3) return message.channel.send(new MessageEmbed()
			.setTitle('📋 Incorrect Usage')
			.setDescription('**Command Name:** moderation\n**Usage:** `game <user>, <punishment>, <reason>')
			.setColor(colours.red)
			.setFooter('<> - Required ● Optional - [] ')).then(m => m.delete({ timeout: 12000 }));


		const { 0: name, 1: punishment, 2: reason } = info;

		if (moderation) moderation.send(new MessageEmbed()
			.setAuthor(`Saikou Group | ${punishment}`, client.user.displayAvatarURL())
			.addField('User:', `${name}`, true)
			.addField('Moderator:', `<@${message.author.id}>`, true)
			.addField('Reason:', `${reason}`)
			.setThumbnail(client.user.displayAvatarURL())
			.setColor(colours.green)
			.setFooter(`${punishment}`)
			.setTimestamp()).catch(() => {});

	}
};
