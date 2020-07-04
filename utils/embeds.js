global.embeds = {
	noCoins(message, name, cost) {
		const embed = new MessageEmbed()
			.setTitle('💰 Insufficent funds!')
			.setDescription(`You need at least \`S$${cost}\` to buy **${name}**!`)
			.setColor(colours.red)
			.setFooter('Insufficent Funds!')
			.setTimestamp();

		message.channel.send(embed);
	},
	noUser(message, name) {
		const embed = new MessageEmbed()
			.setTitle('🔍 Unable to find User!')
			.setDescription(`Please provide a valid user to **${name}**!`)
			.setColor(colours.red)
			.setFooter('No user!')
			.setTimestamp();

		message.channel.send(embed);
	},
	noReason(message, name) {
		const embed = new MessageEmbed()
			.setTitle('📝 No reason provided')
			.setDescription(`Please provide a reason to **${name}** the user!`)
			.setColor(colours.red)
			.setFooter('No reason detected')
			.setTimestamp();

		message.channel.send(embed);
	},
	noPerms(message, perms, name) {
		const embed = new MessageEmbed()
			.setTitle('🔐 Incorrect Permissions')
			.setDescription(`**Command Name:** ${name}\n**Permissions Needed:** ${perms}`)
			.setColor(colours.red)
			.setFooter('<> - Staff Perms ● Public Perms - [] ');

		message.channel.send(embed);
	},
	equalPerms(message, perms) {
		const embed = new MessageEmbed()
			.setTitle('⚙️ Equal Permissions')
			.setDescription('The user you are trying to perform this action on has equal permissions to you, consider..\n\n• Changing the user\'s permissions\n• Changing the user\'s roles')
			.setColor(colours.red)
			.setFooter(`Equal Permission(s): ${perms}`);

		message.channel.send(embed);
	},
	yourself(message, name) {
		const embed = new MessageEmbed()
			.setTitle(`🔐 Cannot ${name} to yourself`)
			.setDescription(`You cannot ${name} to yourself, please input a correct user to use the command on.`)
			.setColor(colours.red)
			.setFooter(`Unable to ${name} to user.`);

		message.channel.send(embed);
	},
	unable(message, name) {
		const embed = new MessageEmbed()
			.setTitle(`❌ Unable to ${name} user`)
			.setDescription(`The user you are trying to perform this action on is unable to be ${name} consider..\n\n• Making sure Saikou's role is higher than theirs\n• User doesn't have an admin/moderator role`)
			.setColor(colours.red)
			.setFooter(`Unable to ${name} user.`);

		message.channel.send(embed);
	},
	bought(message, name, cost) {
		const embed = new MessageEmbed()
			.setTitle('✅ Success!')
			.setDescription(`You successfully bought **${name}** for \`S$${cost}\` from the Military Market!`)
			.setFooter('Successful Purchase')
			.setTimestamp()
			.setColor(colours.green);

		message.channel.send(embed);
	},
	bots(message, name) {
		const embed = new MessageEmbed()
			.setTitle(`❌ Unable to ${name} bots`)
			.setDescription('Saikou cannot perform this action on bots. Consider...\n\n• Doing it manually\n• Gazing into the sunset and rethinking your moderation action')
			.setColor(colours.red)
			.setFooter(`Unable to ${name} user.`);

		message.channel.send(embed);
	}
};

module.exports = {
	name: 'embeds',
	construct(client) {
		return embeds;
	}
}
