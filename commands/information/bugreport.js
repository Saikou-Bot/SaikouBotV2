const time = 5 * 60 * 1000;
const timeoutMessage = 'Bugreport timedout.';

module.exports = {
	config: {
		name: 'bugreport'
	},
	async run({
		client,
		message,
		utils: {
			octokit
		}
	}) {
		const {
			channel,
			author,
			member
		} = message;

		function doStop(msg) {
			if (msg.content == 'stop') {
				msg.channel.send('Bugreport stopped').catch(() => {});
				return true;
			}
		}

		const dm = await member.createDM();

		let askChannel = dm;

		const embed = new MessageEmbed({
			title: 'Please provide title',
			footer: {
				text: 'Times out in 5m',
				iconURL: client.user.avatarURL()
			},
			color: colours.blue
		});
		try {
			await askChannel.send(embed);
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
			askChannel.send(timeoutMessage);
		}

		if (doStop(title)) return;

		embed.setTitle('Please provide description');

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
			askChannel.send(timeoutMessage);
		}

		if (doStop(description)) return;

		try {
			await octokit.issues.create({
				owner: process.env.GITHUB_OWNER,
				repo: process.env.GITHUB_REPO,
				title: title.content,
				body: `Bugreport by: ${author.tag}\nDescription: ${description.content}`,
				labels: [process.env.BUGREPORT_LABEL]
			});
		}
		catch (err) {
			console.log(err);
		}
	}
};