const MessageEmbed = require('../../node_modules/discord.js/src/structures/MessageEmbed');

module.exports = {
	config: {
		name: 'report',
		description: 'Report abuse via this command, make sure to follow the instructions!',
		usage: '.report',
		accessableby: 'Followers+',
		aliases: ['reportabuse'],
		channel: 'report-abuse',
		cooldown: true,
		autoCooldown: true,
	},
	run: async ({ client: bot, message, args }) => {

		message.delete();
		message.channel.send(new MessageEmbed()
			.setDescription(`📬 A message has been sent to your DM's <@${message.author.id}>`)
			.setColor(colours.green)).then(msg => { msg.delete({ timeout: 12000 }); });

		try {
			await message.author.send(new MessageEmbed()
				.setTitle('Report Player')
				.setDescription(`Hello, **${message.author.username}**. Please follow the instructions provided to report a player.\n\n❓ **What is the players Roblox name you are reporting?**\n\nInput **cancel** to cancel your report.`)
				.setFooter('[1/3] This prompt will automatically cancel in 120 seconds.')
				.setColor('2C2F33'));


			const msgs = await message.author.dmChannel.awaitMessages(u2 => u2.author.id === message.author.id, { time: 60000, max: 1, errors: ['time'] });
			const RobloxName = msgs.first().content;

			if (RobloxName.toLowerCase() === 'cancel') {
				return message.author.send(new MessageEmbed()
					.setDescription('Cancelled report!')
					.setColor(colours.green));
			}

			try {
				await message.author.send(new MessageEmbed()
					.setTitle('Report Player')
					.setDescription('Please follow the instructions provided to report a player.\n\n❓ **What is the reason you are reporting them?**\n\nInput **cancel** to cancel your report.')
					.setFooter('[2/3] This prompt will automatically cancel in 120 seconds.')
					.setColor('2C2F33'));


				const msgs2 = await message.author.dmChannel.awaitMessages(u2 => u2.author.id === message.author.id, { time: 60000, max: 1, errors: ['time'] });
				const Reason = msgs2.first().content;

				if (Reason.toLowerCase() === 'cancel') {
					return message.author.send(new MessageEmbed()
						.setDescription('Cancelled report!')
						.setColor(colours.green));
				}

				try {
					await message.author.send(new MessageEmbed()
						.setTitle('Report Player')
						.setDescription('Please follow the final instructions provided to report a player.\n\n**Please input a video/photo of the offence, either via a link or Discord attachment.**\n\nIf you have no proof, you will need to **cancel** the report and gain some!')
						.setFooter('[3/3] This prompt will automatically cancel in 120 seconds.')
						.setColor('2C2F33'));

					const msgs3 = await message.author.dmChannel.awaitMessages(u2 => u2.author.id === message.author.id, { time: 60000, max: 5, errors: ['time'] });
					const Proof = msgs3.first().attachments;
					const ProofLink = msgs3.first().content;

					if (ProofLink.toLowerCase() === 'cancel') {
						return message.author.send(new MessageEmbed()
							.setDescription('Cancelled report!')
							.setColor(colours.green));
					}

					if (!ProofLink.includes('https') && Proof.size === 0) {
						return message.author.send('That is not a link, please retry with an actual link.');
					}

					if (ProofLink.toLowerCase() === 'done') {
						return message.author.send(new MessageEmbed()
							.setTitle('✅ Report Completed')
							.setDescription('Thanks for sending in your report, our staff team will look at it as soon as possible!')
							.setColor(colours.green)
							.setFooter('THIS IS AN AUTOMATED MESSGAE'));
					}

					message.author.send(new MessageEmbed()
						.setTitle('✅ Report Completed')
						.setDescription('Thanks for sending in your report, our staff team will look at it as soon as possible!')
						.setColor(colours.green)
						.setFooter('THIS IS AN AUTOMATED MESSGAE'));

					const embed = new MessageEmbed()
						.setTitle('🛡️ New Report!')
						.setDescription(`**Reported User:** ${RobloxName}\n**Reason:** ${Reason}\n**Proof:**`)
						.setColor(colours.blurple);
					if (!ProofLink) {
						Proof.forEach(attachment => {
							embed.setImage(attachment.url);
							console.log(attachment.url);
						});
					}
					else if (ProofLink && Proof) {
						Proof.forEach(attachment => {
							embed.setImage(attachment.url);
							console.log(attachment.url);
						});
						embed.setDescription(`**Reported User:** ${RobloxName}\n**Reason:** ${Reason}\n**Proof:** ${ProofLink}`);

					}
					else {
						embed.setDescription(`**Reported User:** ${RobloxName}\n**Reason:** ${Reason}\n**Proof:** ${ProofLink}`);
					}

					embed.setFooter(`Reported by: ${message.author.username}`, message.author.displayAvatarURL());

					message.channel.send(embed);

				}
				catch(e) {
					console.log(e);
					return message.author.send(`<@${message.author.id}>`, new MessageEmbed()
						.setTitle('🚫 Report Cancelled!')
						.setDescription('You didn\'t input in time, please try again!')
						.setColor(colours.red));
				}
			}
			catch(e) {
				console.log(e);
				return message.author.send(`<@${message.author.id}>`, new MessageEmbed()
					.setTitle('🚫 Report Cancelled!')
					.setDescription('You didn\'t input in time, please try again!')
					.setColor(colours.red));
			}
		}
		catch(e) {
			return message.channel.send(`<@${message.author.id}>`, new MessageEmbed()
				.setTitle('🚫 Report Cancelled!')
				.setDescription('You either had your DM\'s disabled or didn\'t input in time, please try again!')
				.setColor(colours.red)).then(msg => { msg.delete({ timeout: 20000 }); });
		}
	},
};