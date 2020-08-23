const time = 5 * 60 * 1000

module.exports = {
	config: {	
		name: 'bugreport'
	},
	async run({ client, message, utils: { octokit } }) {
		const { channel, author, member } = message;

		const dm = await member.createDM();

		const embed = new MessageEmbed({
			title: 'Please provide title',
			footer: {
				text: 'Times out in 5m',
				iconURL: client.user.avatarURL()
			},
			color: colours.blue
		})

		askMessage = await dm.send(embed);

		let title;
		try {
			title = (await dm.awaitMessages((collectedMessage) => {
							return collectedMessage.author.id == author.id;
						}, {
							max: 1,
							time,
							errors: ['time']
						})).first();
		}
		catch(err) {
			askMessage.delete().catch(() => {});
			dm.send('Timeout');
		}

		embed.setTitle('Please provide description');

		await askMessage.edit(embed);

		let description;
		try {
			description = (await dm.awaitMessages((collectedMessage) => {
				return collectedMessage.author.id == author.id;
			}, {
				max: 1,
				time,
				errors: ['time']
			})).first();
		}
		catch(err) {
			askMessage.delete().catch(() => {});
			dm.send('Timeout');
		}

		try {
			await octokit.issues.create({
				owner: 'Saikou-Bot',
				repo: 'SaikouBotV2',
				title: title.content,
				body: description.content
			})
		}
		catch(err) {
			console.log(err);
		}
	}
}