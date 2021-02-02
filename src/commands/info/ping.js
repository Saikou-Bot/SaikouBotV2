const { Command } = require('discord-akairo');
const SaikouEmbed = require('../../structure/SaikouEmbed');

class Ping extends Command {
	constructor() {
		super('ping', {
			aliases: ['ping']
		});
	}
	async exec(message) {
		const wsLatency = this.client.ws.ping;
		
		const checkingPingEmbed = new SaikouEmbed()
			.setTitle('🏓 Pinging...')
			.setDescription('Fetching bot and API latency!');

		const sendDate = Date.now();
		const checkMessage = await message.util.send(checkingPingEmbed);
		const restLatency = checkMessage.createdTimestamp - sendDate;


		let restMessage = 'N/A';
		let wsMessage = 'N/A';

		if (restLatency < 300) restMessage = '✅ Normal bot latency.';
		else if (restLatency < 600) restMessage = '⚠️ Higher than average bot latency.';
		else restMessage = '❗ Extremely high bot latency.';

		// WS ping is much lower becuase it uses socket's instead of rest
		if (wsLatency < 200) wsMessage = '✅ Normal API latency.';
		else if (wsLatency < 350) wsMessage = '⚠️ Higher than average API latency.';
		else wsMessage = '❗ Extremely high API latency.';

		const latencyEmbed = new SaikouEmbed()
			.setTitle('🏓 Pong!')
			.addField('Bot Latency:', `${restLatency ? restLatency : 'N/A'}ms`)
			.addField('API Latency:', `${wsLatency ? wsLatency : 'N/A'}ms`)
			.setFooter(`${restMessage}\n${wsMessage}`);

		return checkMessage.edit(latencyEmbed);
	}
}
module.exports = Ping;