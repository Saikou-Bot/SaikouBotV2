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
		if (!config.owners.includes(message.author.id)) return message.channel.send('This command is limited to bot developers only.');

		const command = client.commands.get(args.command);
		if (!command) {
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
		}

		const maintains = utils.maintains;
		const item = await maintains.fetch(command.config.name);
		const status = !item.maintained;
		await maintains.setMaintain(item.name, status);
		let embed;
		if (status) {
			embed = new MessageEmbed({
				title: '✅ Command set as maintained',
				description: 'The commend is now unusable',
				footer: { text: 'BRANDON PLS MAKE ME LOOK BETTER' },
				timestamp: Date.now()
			});
		}
		else {
			embed = new MessageEmbed({
				title: 'Command no longer maintained',
				description: 'pls brandon im suffering from uglyness',
				footer: { text: 'Harry is not nice to me :(' },
				timestamp: Date.now()
			});
		}
		message.channel.send(embed);
	}
};
