const MaintainData = require('../../models/maintainData');

module.exports = {
	config: {
		name: 'maintain',
		arguments: {
			'command': true
		},
		aliases: []
	},
	async run({ client, message, args, utils }) {
		if (!config.owners.includes(message.author.id)) return embeds.owner(message);

		const command = client.commands.get(args.command);
		if (!command)
			return message.channel.send(
				new MessageEmbed({
					title: '🔍 Unable to find Command!',
					description: 'Please provide a existing command name',
					color: colours.red,
					footer: {
						text: 'No command!'
					},
					timestamp: Date.now()
				})
			);


		const maintains = utils.maintains;
		const item = await maintains.fetch(command.config.name);
		const status = !item.maintained;
		await maintains.setMaintain(item.name, status);
		let embed;
		if (status)
			embed = new MessageEmbed({
				title: '✅ Command set as maintained',
				description: 'Command successfully set as being maintained, users will no longer be able to use this command.',
				color: colours.green,
				footer: { text: 'Command under maintenance!' },
				timestamp: Date.now()
			});


		else
			embed = new MessageEmbed({
				title: '✅ Command no longer maintained',
				description: 'Command successfully set as being unmaintained, users will be able to re-use this command.',
				color: colours.green,
				footer: { text: 'Command no longer maintained!' },
				timestamp: Date.now()
			});


		message.channel.send(embed);
	}
};
