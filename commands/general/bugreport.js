const time = 5 * 60 * 1000;
const timeoutMessage = 'Bugreport timedout.';

module.exports = {
	config: {
		name: 'bugreport',
		cooldown: 60 * 1000
	},
	async run({ client, message, utils: { octokit } }) {
		const { channel, author, member } = message;


		const dm = await member.createDM();

		let askChannel = dm;

		function sendStop(msg) {
			return msg.channel.send(new MessageEmbed()
				.setTitle('Report Cancelled')
				.setDescription('Your report was cancelled successfully.\n\nIf you wish to redo a report, you can use the command **bugreport** to start a new prompt.')
				.setFooter('This prompt was cancelled by the user.')
				.setColor(colours.green)).catch(() => {});
		}

		function doStop(msg) {
			if (msg.content == 'cancel') {
				sendStop(msg);
				return true;
			}
		}

		const embed = new MessageEmbed()
			.setTitle('Bug Report')
			.setDescription(`Hello, **${message.author.username}**. Please follow the instructions provided to report a bug.\n\n❓ **What is the title of the bug you are reporting? (e.g. userinfo doesn't show correct user)**\n\nInput **cancel** to cancel your report.`)
			.setFooter(`[1/2] This prompt will automatically cancel in ${time} seconds.`)
			.setColor('2C2F33');

		try {
			await askChannel.send(embed);
			message.channel.send(new MessageEmbed()
				.setDescription(`📬 A message has been sent to your DM's <@${message.author.id}>`)
				.setColor(colours.green)).then(msg => { msg.delete({ timeout: 12000 }); });
		}
		catch(err) {
			askChannel = channel;
			askChannel.send(embed);
		}

		let title;
		try {
			title = (await askChannel.awaitMessages((collectedMessage) => {
				return collectedMessage.author.id == author.id;
			}, {
				max: 1,
				time,
				errors: ['time']
			})).first();
		}
		catch (err) {
			return askChannel.send(timeoutMessage);
		}

		if (doStop(title)) return;

		embed.setDescription('Please follow the final instructions provided to report a bug.\n\n❓ **What is the description of the bug you are reporting? (Make sure to go into detail to help us fix it!)**\n\nInput **cancel** to cancel your report.');
		embed.setFooter(`[2/2] This prompt will automatically cancel in ${time} seconds.`);

		await askChannel.send(embed);

		let description;
		try {
			description = (await askChannel.awaitMessages((collectedMessage) => {
				return collectedMessage.author.id == author.id;
			}, {
				max: 1,
				time,
				errors: ['time']
			})).first();
		}
		catch (err) {
			return askChannel.send(timeoutMessage);
		}

		if (doStop(description)) return;

		await octokit.issues.create({
			owner: config.githubOwner,
			repo: config.githubRepo,
			title: title.content,
			body: `Bugreport by: ${author.tag}\nDescription: ${description.content}`,
			labels: [config.bugreportLabel]
		});

		message.author.send(new MessageEmbed()
			.setTitle('✅ Report Completed')
			.setDescription('Thanks for sending in your report, our developers will look at it as soon as possible!')
			.setColor(colours.green)
			.setFooter('THIS IS AN AUTOMATED MESSAGE'));
		this.cooldown.add(member);
	}
};