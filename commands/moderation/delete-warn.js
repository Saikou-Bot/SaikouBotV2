const { model: Warn } = require('../../models/warn');

module.exports = {
	config: {
		name: 'delete-warn',
		aliases: ['delwarn'],
		arguments: {
			'warnID': true
		}
	},
	async run({ message, args, utils: { getUserMod }, databases }) {
		const warn = await Warn.findById(args.warnID);

		if (!warn) {
			return message.channel.send(new discord.MessageEmbed({
				title: 'No such warn',
				color: colours.red
			}));
		}

		try {
			await warn.remove();
		}
		catch(err) {
			console.error(err);
			return message.channel.send(new discord.MessageEmbed({
				title: 'Failed to delete warn',
				color: colours.red
			}));
		}

		return message.channel.send(new discord.MessageEmbed({
			title: 'Succesfully deleted warn',
			color: colours.green
		}));
	}
};