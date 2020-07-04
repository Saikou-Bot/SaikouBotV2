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
				.setTitle('Input')
				.setDescription(`Hello, **${message.author.username}**. Please follow the instructions provided to report a player.\n\n**What is the players Roblox name you are reporting (Make sure to spell it correctly)?**\n\nInput **cancel** to cancel your report.`)
				.setFooter('This prompt will automatically cancel in 120 seconds.')
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
					.setTitle('Input 2')
					.setDescription('Please follow the instructions provided to report a player.\n\n**What is the reason you are reporting them?**\n\nInput **cancel** to cancel your report.')
					.setFooter('This prompt will automatically cancel in 120 seconds.')
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
						.setTitle('Input 3')
						.setDescription('Please follow the final instruction provided to report a player.\n\n**Please input a video/photo of the offence, either via a link or Discord attachment.**\n\nIf you have no proof, type in **skip** to skip this prompt.\n\nInput **cancel** to cancel your report.')
						.setFooter('This prompt will automatically cancel in 120 seconds.')
						.setColor('2C2F33'));

					const msgs3 = await message.author.dmChannel.awaitMessages(u2 => u2.author.id === message.author.id, { time: 60000, max: 1, errors: ['time'] });
					const Proof = msgs3.first().attachments;
					let ProofLink = msgs3.first().content;

					if (ProofLink.toLowerCase() === 'cancel') {
						return message.author.send(new MessageEmbed()
							.setDescription('Cancelled report!')
							.setColor(colours.green));
					}

					if (ProofLink === 'skip') {
						ProofLink = '⚠️ None provided.';
					}

					message.author.send(new MessageEmbed()
						.setTitle('✅ Report Completed')
						.setDescription('Thanks for sending in your report, our staff team will look at it as soon as possible!')
						.setColor(colours.green)
						.setFooter('THIS IS AN AUTOMATED MESSGAE'));

					const embed = new MessageEmbed()
						.setTitle('🛡️ New reported user!')
						.setDescription(`**Reported User:** ${RobloxName}\n**Reason:** ${Reason}`)
						.setColor(colours.blurple);
					if (!ProofLink) {
						Proof.forEach(attachment => {
							embed.setImage(attachment.url);
							console.log(attachment.url);
						});
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
