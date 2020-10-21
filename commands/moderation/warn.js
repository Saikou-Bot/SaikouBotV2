module.exports = {
	config: {
		name: 'warn',
		description: 'Reserved for the staff team to warn a user.',
		usage: '.warn <user> <reason>',
		accessableby: 'Staff',
		aliases: ['givewarn'],
	},
	run: async ({ client: bot, message, args, utils: { getUserMod, warn: warnUtil }, databases }) => {

		const member = getUserMod(message, args[0]);

		if (!message.member.hasPermission('MANAGE_MESSAGES')) {
			return embeds.noPerms(message, '<Manage Messages>' || message, '.warn');
		}

		if (!member) {
			return embeds.noUser(message, 'warn');
		}

		if (member.hasPermission('MANAGE_MESSAGES')) {
			return embeds.equalPerms(message, 'Manage Messages');
		}

		const reason = args.slice(1).join(' ');

		if (!reason) {
			return embeds.noReason(message, 'warn');
		}

		const warn = new databases.warn.model({
			guildID: message.guild.id,
			memberID: member.id,
			moderatorID: message.author.id,
			reason: reason
		});

		await warn.save();

		const warnings = await databases.warn.model.find({
			guildID: message.guild.id,
			memberID: member.id
		});

		const embed = new MessageEmbed()
			.setDescription(`✅ **${member.displayName} has been warned**`)
			.addField('Warnings:', warnings.length, true)
			.setColor(colours.green);

		message.channel.send(embed);

		member.send(new MessageEmbed()
			.setTitle('Warning')
			.setDescription('You have received a **Warning** in Saikou due to your behaviour within our server. Improve how you act otherwise you will be punished again.')
			.addField('Warned By', `${message.author.tag}`)
			.addField('Reason', `${reason}`)
			.setColor(colours.red)
			.setFooter('THIS IS AN AUTOMATED MESSAGE')
			.setTimestamp()).catch(() => {
			return;
		});

		modLogs.send(new MessageEmbed()
			.setAuthor(`Case ${warnings.length} | Warning | ${member.displayName}`, member.user.displayAvatarURL())
			.addField('User:', `<@${member.id}>`, true)
			.addField('Moderator', `<@${message.author.id}>`, true)
			.addField('Reason', `${reason}`, true)
			.setColor(colours.red)
			.setFooter(`Warned User ID: ${member.id}`)
			.setTimestamp());
	},
};
