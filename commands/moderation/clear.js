const errors = embeds;

module.exports = {
	config: {
		name: 'clear',
		description: 'Reserved for the staff team to bulk delete messages.',
		usage: '.clear <messages> <reason>',
		accessableby: 'Staff',
		aliases: ['purge', 'bulkdelete', 'messageremove'],
	},
	run: async ({ client: bot, message, args }) => {

		const deleteAmount = args[0];
		const reason = args.slice(1).join(' ');

		if (!message.member.hasPermission('MANAGE_MESSAGES')) return errors.noPerms(message, '<Manage Messages>' || message, '.clear');


		if (isNaN(deleteAmount) || parseInt(deleteAmount) <= 0)
			return message.channel.send(new MessageEmbed()
				.setTitle('🔢 Specify Amount!')
				.setDescription('Please provide an amount that doesn\'t contain letters or is less than 1!')
				.setColor(colours.red)
				.setFooter('No amount detected')
				.setTimestamp());


		if (parseInt(deleteAmount) > 100)
			return message.channel.send(new MessageEmbed()
				.setTitle('🔢 Amount over 100!')
				.setDescription('Please provide an amount that is less than 100!')
				.setColor(colours.red)
				.setFooter('Amount over 100')
				.setTimestamp());


		if (!reason)
			return message.channel.send(new MessageEmbed()
				.setTitle('📝 No reason provided')
				.setDescription('Please provide a reason to clear the messages!')
				.setColor(colours.red)
				.setFooter('No reason detected')
				.setTimestamp());


		await message.channel.bulkDelete(deleteAmount, true).then(
			message.channel.send(new MessageEmbed()
				.setDescription(`✅ **${deleteAmount} messages deleted.**`)
				.setColor(colours.green)).then(msg => { msg.delete({ timeout: 15000 }); })
		);

		modLogs.send(new MessageEmbed()
			.setAuthor(`Bulk Delete | ${deleteAmount} messages | ${message.author.username}`, message.author.displayAvatarURL())
			.addField('Channel:', `<#${message.channel.id}>`, true)
			.addField('Moderator:', `<@${message.author.id}>`, true)
			.addField('Reason:', `${reason}`, true)
			.setColor(colours.yellow)
			.setFooter(`Channel ID: ${message.channel.id}`)
			.setTimestamp());
	}
};