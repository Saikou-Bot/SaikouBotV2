const urlRegex = require('url-regex')();
const Axios = require('axios');

module.exports = {
	config: {
		name: 'report',
		description: 'Report abuse via this command, make sure to follow the instructions!',
		usage: '.report',
		accessableby: 'Followers+',
		aliases: ['reportabuse'],
		channel: 'report-abuse',
		cooldown: 5 * 60 * 1000,
	},
	run: async ({ client, message, args }) => {

		message.delete().catch(() => {});
		try {
			await message.author.send(new MessageEmbed()
				.setTitle('Report Player')
				.setDescription(`Hello, **${message.author.username}**. Please follow the instructions provided to report a player.\n\n❓ **What is the players Roblox name you are reporting?**\n\nInput **cancel** to cancel your report.`)
				.setFooter('[1/3] This prompt will automatically cancel in 120 seconds.')
				.setColor('2C2F33'));
		}
		catch(err) {
			if (err.httpStatus == 403) {
				return message.channel.send(new MessageEmbed({
					title: 'Bot failed to dm',
					description: 'Make sure you have DM\' enabled',
					color: colours.red
				}));
			}
			throw err;
		}
		message.channel.send(new MessageEmbed()
			.setDescription(`📬 A message has been sent to your DM's <@${message.author.id}>`)
			.setColor(colours.green)).then(msg => msg.delete({ timeout: 12000 })).catch(() => {});

		function sendCancel() {
			return message.author.send(new MessageEmbed()
				.setTitle('Report Cancelled')
				.setDescription('Your report was cancelled successfully.\n\nIf you wish to redo a report, you can use the command **report** to start a new prompt.')
				.setFooter('This prompt was cancelled by the user.')
				.setColor(colours.green));
		}

		function sendTimeout() {
			return message.author.send(message.author, new MessageEmbed()
				.setTitle('🚫 Report Cancelled!')
				.setDescription('You didn\'t input in time, please try again!')
				.setColor(colours.red));
		}

		function checkCancel(msg) {
			if (msg.content == 'cancel') return sendCancel().then(() => true);
			else return false;
		}

		const dmChannel = await message.author.createDM();

		let robloxName = '';

		try {
			const collectedMessages = await dmChannel.awaitMessages(m => m.author.id == message.author.id, { time: 120000, max: 1, errors: ['time'] });
			const collectedMessage = collectedMessages.first();

			if (await checkCancel(collectedMessage)) return;

			robloxName = collectedMessage.content;
		}
		catch(err) {
			return sendTimeout();
		}

		await message.author.send(new MessageEmbed()
			.setTitle('Report Player')
			.setDescription('Please follow the instructions provided to report a player.\n\n❓ **What is the reason you are reporting them?**\n\nInput **cancel** to cancel your report.')
			.setFooter('[2/3] This prompt will automatically cancel in 120 seconds.')
			.setColor('2C2F33'));

		let reason = '';
		try {
			const collectedMessages = await dmChannel.awaitMessages(m => m.author.id == message.author.id, { time: 120000, max: 1, errors: ['time'] });
			const collectedMessage = collectedMessages.first();

			if (await checkCancel(collectedMessage)) return;

			reason = collectedMessage.content;
		}
		catch(err) {
			return sendTimeout();
		}

		await message.author.send(new MessageEmbed()
			.setTitle('Report Player')
			.setDescription('Please follow the final instructions provided to report a player.\n\n**Please input a video/photo of the offence, either via a link or Discord attachment.**\n\nIf you have no proof, you will need to **cancel** the report and gain some!')
			.setFooter('[3/3] This prompt will automatically cancel in 120 seconds.')
			.setColor('2C2F33'));

		const attachmentCollector = dmChannel.createMessageCollector(m => m.author.id == message.author.id,
			{
				idle: 120000,
				max: 10
			});

		const attachments = [];
		const videos = [];

		attachmentCollector.on('collect', async (msg) => {
			if (await checkCancel(msg)) {
				return attachmentCollector.stop('cancel');
			}

			if (msg.content == 'done') {
				return attachmentCollector.stop();
			}
			let content = msg.content;

			const messageAttachments = msg.attachments;

			const links = [...[...(msg.content || '').matchAll(urlRegex)].map(m => m[0]), ...messageAttachments.map(a => a.url)];

			if (links.length == 1 && msg.content == links[0]) content = '';

			let mediaLinks = { images: [], videos: [] };


			if (links.length > 0) {
				const timeout = Axios.CancelToken.source();
				mediaLinks = (await Promise.allSettled(links.map(l => Axios.head(l, { cancelToken: timeout.token })))).filter(r => r.status == 'fulfilled' && r.value.headers['content-type']).map(res => res.value).reduce((ml, r) => {
					if (r.headers['content-type'].startsWith('image')) ml.images.push(r.config.url);
					else if (r.headers['content-type'].startsWith('video')) ml.videos.push(r.config.url);
					return ml;
				},
				mediaLinks);
				setTimeout(() => {
					timeout.cancel('timeout');
				}, 5000);
			}

			if (mediaLinks.images.length + mediaLinks.videos.length < 1) return message.author.send('That is not a link, please retry with an actual link.');


			if (messageAttachments.length > 0) {
				messageAttachments.forEach(attachment => {
					attachments.push({
						content,
						url: attachment.url
					});
					content = '';
				});
			}
			if (mediaLinks.images.length > 0) {
				mediaLinks.images.forEach(link => {
					attachments.push({
						content,
						url: link
					});
					content = '';
				});
			}
			if (mediaLinks.videos.length > 0) {
				mediaLinks.videos.forEach(link => {
					videos.push({
						content,
						url: link
					});
					content = '';
				});
			}
		});

		attachmentCollector.once('end', async (collected, r) => {
			if (r == 'idle') return sendTimeout();
			else if (r == 'cancel') return;
			message.author.send(new MessageEmbed()
				.setTitle('✅ Report Completed')
				.setDescription('Thanks for sending in your report, our staff team will look at it as soon as possible!')
				.setColor(colours.green)
				.setFooter('THIS IS AN AUTOMATED MESSAGE')).catch(() => {});

			const embed = new MessageEmbed()
				.setTitle('🛡️ New Report!')
				.setDescription(`**Reported User:** ${robloxName}\n**Reason:** ${reason}`)
				.setColor(colours.blurple);

			await message.channel.send(embed);

			this.cooldown.add(message.member);

			for (let i = 0; i < attachments.length; i++) {
				const attachment = attachments[i];
				await message.channel.send(new MessageEmbed({
					title: attachment.content,
					image: {
						url: attachment.url
					},
					color: colours.blurple
				})).catch(() => {});
			}
			for (let i = 0; i < videos.length; i++) {
				const video = videos[i];
				const cleanContent = video.content.replace(urlRegex, '<$&>');

				await message.channel.send(cleanContent, {
					files: [video.url]
				});
			}
		});


		// 	const Proof = msgs3.first().attachments;
		// 	const ProofLink = msgs3.first().content;

		// 	if (ProofLink.toLowerCase() === 'cancel') {
		// 		return message.author.send(new MessageEmbed()
		// 			.setDescription('Cancelled report!')
		// 			.setColor(colours.green));
		// 	}

		// 	if (!ProofLink.includes(/(https|http)/) && Proof.size === 0) {
		// 		return message.author.send('That is not a link, please retry with an actual link.');
		// 	}

		// if (ProofLink.toLowerCase() === 'done') {
		// 	return message.author.send(new MessageEmbed()
		// 		.setTitle('✅ Report Completed')
		// 		.setDescription('Thanks for sending in your report, our staff team will look at it as soon as possible!')
		// 		.setColor(colours.green)
		// 		.setFooter('THIS IS AN AUTOMATED MESSAGE'));
		// }

		// 	message.author.send(new MessageEmbed()
		// 		.setTitle('✅ Report Completed')
		// 		.setDescription('Thanks for sending in your report, our staff team will look at it as soon as possible!')
		// 		.setColor(colours.green)
		// 		.setFooter('THIS IS AN AUTOMATED MESSGAE'));

		// const embed = new MessageEmbed()
		// 	.setTitle('🛡️ New Report!')
		// 	.setDescription(`**Reported User:** ${RobloxName}\n**Reason:** ${Reason}\n**Proof:**`)
		// 	.setColor(colours.blurple);
		// 	if (!ProofLink) {
		// 		Proof.forEach(attachment => {
		// 			embed.setImage(attachment.url);
		// 			console.log(attachment.url);
		// 		});
		// 	}
		// 	else if (ProofLink && Proof) {
		// 		Proof.forEach(attachment => {
		// 			embed.setImage(attachment.url);
		// 			console.log(attachment.url);
		// 		});
		// 		embed.setDescription(`**Reported User:** ${RobloxName}\n**Reason:** ${Reason}\n**Proof:** ${ProofLink}`);

		// 	}
		// 	else {
		// 		embed.setDescription(`**Reported User:** ${RobloxName}\n**Reason:** ${Reason}\n**Proof:** ${ProofLink}`);
		// 	}

		// 	embed.setFooter(`Reported by: ${message.author.username}`, message.author.displayAvatarURL());

		// 	message.channel.send(embed);

		// }
	},
};