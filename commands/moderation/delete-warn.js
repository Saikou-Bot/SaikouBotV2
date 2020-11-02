const Warn = require('../../models/warn');

module.exports = {
	config: {
		name: 'delete-warn',
		aliases: ['delwarn'],
		arguments: {
			'warnID': true
		}
	},
	async run({ message, args }) {
		let warn;
		try {
			warn = await Warn.findById(args.warnID);
		}
		catch(err) {
			return message.channel.send(new MessageEmbed()
				.setTitle('❌ Invalid warning!')
				.setDescription('The warning you are trying to delete doesn\'t exist or is invalid, please try again with a correct warning ID.')
				.setFooter('Please provide a correct warning ID.')
				.setColor(colours.red));
		}

		if (!message.member.hasPermission('MANAGE_MESSAGES')) return embeds.noPerms(message, '<Manage Messages>' || message, '.delwarn');


		if (!warn)
			return message.channel.send(new MessageEmbed()
				.setTitle('❌ Invalid warning!')
				.setDescription('The warning you are trying to delete doesn\'t exist or is invalid, please try again with a correct warning ID.')
				.setFooter('Please provide a correct warning ID.')
				.setColor(colours.red));


		try {
			await warn.remove();
		}
		catch(err) {
			console.error(err);
			return message.channel.send(new MessageEmbed()
				.setTitle('❌ Failed to delete!')
				.setDescription('The warning you are trying to delete didn\'t remove correctly, please try again or if this error perists, contact the bot developers.')
				.setFooter('Failed to delete warning.')
				.setColor(colours.red));
		}

		return message.channel.send(new MessageEmbed()
			.setTitle('✅ Warning removed!')
			.setDescription('The warning has been successfully deleted and removed from the users warnings.')
			.setFooter('Successfully deleted.')
			.setColor(colours.green));
	}
};