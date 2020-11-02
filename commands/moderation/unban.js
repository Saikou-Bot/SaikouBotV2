const errors = embeds;

module.exports = {
	config: {
		name: 'unban',
		description: 'Reserved for the staff team to unban a user.',
		usage: '.unban <user>',
		accessableby: 'Staff',
		aliases: ['removeban'],
	},
	run: async ({ client: bot, message, args }) => {

		const user = args[0];

		if (!message.member.hasPermission('BAN_MEMBERS')) return errors.noPerms(message, '<Ban Members>' || message, '.unban');


		if (!user)
			return message.channel.send(new MessageEmbed()
				.setTitle('🔍 Unable to find User!')
				.setDescription('Please provide a valid user ID to **unban**!')
				.setColor(colours.red)
				.setFooter('No user!')
				.setTimestamp());


		message.guild.fetchBans().then(ban => {

			if (ban.size === 0)
				return message.channel.send(new MessageEmbed()
					.setTitle('🔍 Unable to find User!')
					.setDescription('Please provide a valid user ID to **unban**!')
					.setColor(colours.red)
					.setFooter('No user!')
					.setTimestamp());


			const bannedUser = ban.find(member => member.user.id === user);

			if (!bannedUser)
				return message.channel.send(new MessageEmbed()
					.setTitle('🔍 Unable to find User!')
					.setDescription('Please provide a valid user ID to **unban**!')
					.setColor(colours.red)
					.setFooter('No user!')
					.setTimestamp());


			message.guild.members.unban(bannedUser.user);

			message.channel.send(new MessageEmbed()
				.setDescription(`✅ **${bannedUser.user.username} has been unbanned.**`)
				.setColor(colours.green));
		});
	}
};