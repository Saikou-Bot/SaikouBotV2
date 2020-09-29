const pckg = require('../../package.json');
const os = require('os');

module.exports = {
	config: {
		name: 'status',
		description: 'Want to check if the bot is running into any issues? The status command will give some basic information on how it is doing!',
		usage: '.status',
		accessableby: 'Followers+',
		aliases: ['stats', 'bot', 'botinfo'],
		channel: 'bot-commands'
	},
	run: async ({ client: bot, message }) => {

		// const msg = await message.channel.send(new MessageEmbed()
			// .setDescription('Loading...')
			// .setColor(colours.blurple));

		const botLatency = bot.ws.ping;
		const memoryUsage = process.memoryUsage();
		const totalMemory = memoryUsage.heapTotal;
		const memoryPercentage = (totalMemory - memoryUsage.heapUsed) / totalMemory * 100;
		let statusMsg = '';
		let memoryMsg = '';

		function duration(ms) {
			const sec = Math.floor((ms / 1000) % 60).toString();
			const min = Math.floor((ms / (1000 * 60)) % 60).toString();
			const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
			return `${hrs.padStart(2, '0')} hrs, ${min.padStart(2, '0')} mins, ${sec.padStart(2, '0')} secs `;
		}

		const status = new MessageEmbed()
			.setTitle('Saikou Bot Status')
			.setDescription(`**${bot.user.username}** has been running for \`${duration(bot.uptime)}\`\nDown below lists some statistics.\n\n**Bot Latency:** \`${botLatency}ms\`\n**Version:** \`${pckg.version}\`\n**Memory Usage:** \`${Math.round(memoryPercentage)}%\` `)
			.setThumbnail(bot.user.displayAvatarURL());

		// Memory Usage
		if (memoryPercentage > 29 && memoryPercentage < 50) {
			memoryMsg = '⚠️ Higher than average memory usage.';
		}
		else if (memoryPercentage > 0 && memoryPercentage < 30) {
			memoryMsg = '✅ Normal memory usage.';
		}
		else if (memoryPercentage > 49 && memoryPercentage < 999999999) {
			memoryMsg = '❗ Extremely high memory usage.';
		}
		else {
			memoryMsg = '✅ Normal memory usage.';
		}

		// Bot latency
		if (botLatency > 199 && botLatency < 600) {
			status.setColor(colours.yellow);
			statusMsg = '⚠️ Higher than average bot latency.';
		}
		else if (botLatency > 0 && botLatency < 200) {
			status.setColor(colours.green);
			statusMsg = '✅ Normal bot latency.';
		}
		else if (botLatency > 599 && botLatency < 999999999) {
			status.setColor(colours.red);
			statusMsg = '❗ Extremely high bot latency.';
		}
		else {
			status.setColor(colours.green);
			statusMsg = '✅ Normal bot latency.';
		}

		status.addField('Acknowledgements', `${statusMsg}\n${memoryMsg}`);
		message.channel.send(status);
	},
};
