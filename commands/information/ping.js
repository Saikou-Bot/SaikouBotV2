const replies = ['Here you go! Down below will list some information about the latency.', 'Successfully fetched bot and API latency.', 'There you go! Acknowledgements about the pings will be listed in the footer.'];
module.exports = {
	config: {
		name: 'ping',
		description: 'Displays bot and API latency.',
		usage: '.ping',
		accessableby: 'Followers+',
		aliases: ['latency', 'botping', 'apilatency', 'botlatency'],
		channel: 'bot-commands',
		cooldown: true,
		autoCooldown: true
	},
	run: async ({ client: client, message }) => {

		let footer = '';

		const pinging = new MessageEmbed()
			.setTitle('🏓 Pinging...')
			.setDescription('Fetching bot and API latency!')
			.setColor(colours.blurple);

		const msg = await message.channel.send(pinging);
		const botLatency = msg.createdTimestamp - message.createdTimestamp;
		const APILatency = client.ws.ping;
		const result = Math.floor((Math.random() * replies.length));

		const latencyEmbed = new MessageEmbed()
			.setTitle('🏓 Pong!');

		if (botLatency > 199 && botLatency < 600) {
			footer = '⚠️ Higher than average bot latency.';
		}
		else if (botLatency > 599 && botLatency < 999999999) {
			footer = '❗ Extremely high bot latency.';
		}
		else {
			footer = '✅ Normal bot latency.';
		}

		// API latency
		if (APILatency > 199 && APILatency < 600) {
			latencyEmbed.setFooter(`${footer}\n⚠️ Higher than average API latency.`);
		}
		else if (APILatency > 599 && APILatency < 999999999) {
			latencyEmbed.setFooter(`${footer}\n❗ Extremely high API latency.`);
		}
		else {
			latencyEmbed.setFooter(`${footer}\n✅ Normal API latency.`);
		}

		latencyEmbed.setDescription(replies[result]);
		latencyEmbed.addField('Bot Latency:', `${botLatency}ms`, true);
		latencyEmbed.addField('API Latency:', `${APILatency}ms`, true);
		latencyEmbed.setColor(colours.blurple);

		return msg.edit(latencyEmbed);
	},
};
