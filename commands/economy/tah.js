const MessageEmbed = require('../../node_modules/discord.js/src/structures/MessageEmbed');
const userData = require('../../models/userData');
const userQuests = require('../../models/userQuests');

module.exports = {
	config: {
		name: 'tah',
		description: 'Play against your friends or with AI in a spinoff of rock paper scissors!',
		usage: '.tah',
		accessableby: 'Followers+',
		aliases: ['tankaaheli', 'rps'],
		channel: 'bot-commands',
		cooldown: 180000,
		autoCooldown: true,
	},
	run: async (bot, message, args) => {

		const reactions = ['👍', '👎'];
		const tank = bot.emojis.cache.get('724255516603449356');
		const aa = bot.emojis.cache.get('724256139335827547');
		const heli = bot.emojis.cache.get('724263455099453502');
		const choose = [heli.id, tank.id, aa.id];

		const filter = (reaction, user) => choose.includes(reaction.emoji.id) && user.id === message.author.id;

		const credits = await userData.findOne({ userID: message.author.id });

		if(!credits) {
			const newData = new userData({
				username: message.author.username,
				userID: message.author.id,
				lb: 'all',
				coins: 0,
				medals: 0,
			});
			await newData.save().catch(err => console.log(err));
			return message.channel.send(new MessageEmbed()
				.setTitle('No balance')
				.setDescription('Your balance has now been created, please try the command again!')
				.setThumbnail(message.author.displayAvatarURL())
				.setColor(colours.red));
		}

		message.channel.send('Do you want to play against AI or a user?');


		try {
			const msgs = await message.channel.awaitMessages(u2 => u2.author.id === message.author.id, { time: 20000, max: 1, errors: ['time'] });

			if (msgs.first().content.toLowerCase() === 'force' || msgs.first().content.toLowerCase() === 'forcetower') {

				const reactOption = await message.channel.send('You feel a strange overwhelming power...', new MessageEmbed()
					.setTitle('TAH AI')
					.setDescription('Please react to one of the reactions to choose your option.')
					.setFooter('Turn back whilst you can...')
					.setColor(colours.green));

				choose.forEach(r => {
					reactOption.react(r);
				});

				try {
					const collected = await reactOption.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] });
					const reaction = collected.first();

					await reactOption.reactions.removeAll();

					const won1 = new MessageEmbed()
						.setTitle('T̵A̵H̶ ̶R̵e̵s̴u̷l̸t̶s̸!̵')
						.setDescription('You feel the ground shake and see a bright golden light, that\'s when you realised the terrible mistake you made.')
						.addField(`${message.author.username}`, `Chose \`${reaction.emoji.name}\``, true)
						.addField('Force', 'Chose `Golden Katana`', true)
						.setColor(message.member.displayHexColor)
						.setThumbnail(message.author.displayAvatarURL());
					reactOption.edit('', won1);

					userQuests.findOne({ UserID: message.author.id, Quest: 'Secret Hunter', completed: false }, (err, tahQuest) => {

						if (tahQuest) {
							message.channel.send(`You completed the quest **Secret Hunter** and was rewarded ${tahQuest.Reward.toLocaleString()} credits.`);
							credits.coins += tahQuest.Reward;
							tahQuest.completed = true;
							tahQuest.save();
						}
						credits.save();
					});
				}
				catch(e) {
					return message.channel.send('Input an option.');
				}
			}

			else if (msgs.first().content.toLowerCase() === 'ai') {

				const reactOption = await message.channel.send(new MessageEmbed()
					.setTitle('TAH AI')
					.setDescription('Please react to one of the reactions to choose your option.')
					.setColor(colours.green));

				choose.forEach(r => {
					reactOption.react(r);
				});

				try {
					const collected = await reactOption.awaitReactions(filter, { max: 1, time: 30000 }); // errors: ['time']
					const reaction = collected.first();


					const aiChoice = Math.floor((Math.random() * choose.length));

					const getResult = function(user, ai) {
						if ((user === heli.id && ai === tank.id) ||
						(user === tank.id && ai === aa.id) ||
						(user === aa.id && ai === heli.id)) {
							credits.coins += 100;
							credits.save();
							return 'You ||won `S$100` for winning to|| **Saikou** in Tank AA Helicopter.';
						}
						else if (user === ai) {
							return 'You drew to **Saikou** in Tank AA Helicopter.';
						}
						else {
							credits.coins -= 50;
							credits.save();
							return 'You ||lost `S$50` for losing to|| **Saikou** in Tank AA Helicopter.';
						}
					};

					const result = getResult(reaction.emoji.id, choose[aiChoice]);
					await reactOption.reactions.removeAll();

					const won1 = new MessageEmbed()
						.setTitle('TAH Results!')
						.setDescription(result)
						.addField(`${message.author.username}`, `Chose \`${reaction.emoji.name}\``, true)
						.addField('Saikou', `Chose \`${bot.emojis.cache.get(choose[aiChoice]).name}\``, true)
						.setColor(message.member.displayHexColor)
						.setThumbnail(message.author.displayAvatarURL());
					reactOption.edit(won1);

				}
				catch(e) {
					return reactOption.edit(new MessageEmbed()
						.setTitle('<:tank:724255516603449356> Match cancelled!')
						.setDescription(`<@${message.author.id}> didn't react in time.`)
						.setColor(colours.red));
				}


			}
			else if (msgs.first().content.toLowerCase() === 'user') {
				await message.channel.send('Tag a user to play with them.');

				const inputtedUser = await message.channel.awaitMessages(u2 => u2.author.id === message.author.id, { time: 20000, max: 1 });
				const userMatch = inputtedUser.first().content.match(/\d+/);

				if (!userMatch) {
					return message.channel.send(new MessageEmbed()
						.setTitle('🔍 Unable to find User!')
						.setDescription('Please provide a valid user to play against!')
						.setColor(colours.red)
						.setFooter('Invalid user!')
						.setTimestamp());
				}
				const member = userMatch[0];

				if (member === message.author.id) {
					return message.channel.send(new MessageEmbed()
						.setTitle('🔐 Cannot play against yourself')
						.setDescription('You cannot play against yourself, please input the ai version to play against Saikou.')
						.setColor(colours.red)
						.setFooter('Unable to play against.'));
				}

				if (member === bot.user.id) {
					return message.channel.send(new MessageEmbed()
						.setTitle('🔐 Cannot play against Saikou')
						.setDescription('You cannot play against Saikou in this mode, please choose the AI version instead.')
						.setColor(colours.red)
						.setFooter('Unable to play against Saikou.'));
				}

				const usercredits = await userData.findOne({ userID: member });

				if(!usercredits) {
					bot.users.fetch(`${member}`).then((userInfo) => {
						const newData = new userData({
							username: userInfo.username,
							userID: userInfo.id,
							lb: 'all',
							coins: 0,
							medals: 0,
						});
						newData.save().catch(err => console.log(err));
					});
					return message.channel.send(new MessageEmbed()
						.setTitle('No balance')
						.setDescription(`<@${member}> has no balance, one has now been created, please try the command again!`)
						.setColor(colours.red));
				}


				const getResult = function(user1, user2) {
					if ((user1 === heli.id && user2 === tank.id) ||
						(user1 === tank.id && user2 === aa.id) ||
						(user1 === aa.id && user2 === heli.id)) {
						credits.coins += 100;
						credits.save();
						return `Player ||<@${message.author.id}> won \`S$100\` for winning to <@${member}> || in Tank AA Helicopter.`;
					}
					else if (user1 === user2) {
						return `Player ||<@${message.author.id}> drew with <@${member}>|| in Tank AA Helicopter.`;
					}
					else {
						usercredits.coins += 100;
						usercredits.save();
						return `Player ||<@${member}> won \`S$100\` for winning to <@${message.author.id}> || in Tank AA Helicopter.`;
					}
				};


				const gameStartMsg = await message.channel.send(`<@${member}>`, new MessageEmbed()
					.setTitle('TAH Invitation')
					.setDescription(`${message.author.username} has invited you to play TAH, react with 👍 to accept or 👎 to decline.`)
					.setColor(colours.green)
					.setFooter('Game will auto end if no input in 30 seconds.'));
				gameStartMsg.react('👍');
				gameStartMsg.react('👎');


				try {
					const filter2 = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === member;
					const collected = await gameStartMsg.awaitReactions(filter2, { max: 1, time: 30000 }).catch(e => console.log(e)); // errors: ['time']
					const reaction = collected.first();


					if (reaction.emoji.name === '👎') {
						return message.channel.send(`<@${message.author.id}>, user has declined the match!`);
					}
					else {
						await gameStartMsg.reactions.removeAll();
						gameStartMsg.edit('', new MessageEmbed()
							.setTitle(`${message.author.username} is picking a reaction!`)
							.setDescription(`Please wait for **${message.author.username}** to pick a reaction, check your DM's to pick an option.`)
							.setColor(colours.green)
							.setFooter('Game will auto end if no reaction happens in 30 seconds.'));

						try {
							const reactEmbed = await message.author.send(new MessageEmbed()
								.setTitle('TAH Multiplayer')
								.setDescription('Please react to one of the reactions to choose your option.')
								.setColor(colours.green));

							choose.forEach(r => {
								reactEmbed.react(r);
							});


							const Usercollected = await reactEmbed.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] });
							const Userreaction = Usercollected.first();


							gameStartMsg.edit('', new MessageEmbed()
								.setTitle('Player2 is picking a reaction!')
								.setDescription(`Please wait for <@${member}> to pick a reaction, check your DM's to pick an option.`)
								.setColor(colours.green)
								.setFooter('Game will auto end if no reaction happens in 30 seconds.'));


							try {
								const reactEmbed2 = await bot.users.fetch(`${member}`).then(r => r.send(new MessageEmbed()
									.setTitle('TAH Multiplayer')
									.setDescription('Please react to one of the reactions to choose your option.')
									.setColor(colours.green)));

								choose.forEach(r => {
									reactEmbed2.react(r);
								});

								const userfilter = (userreaction, user) => choose.includes(userreaction.emoji.id) && user.id === member;
								const Usercollected2 = await reactEmbed2.awaitReactions(userfilter, { max: 1, time: 30000, errors: ['time'] });
								const Userreaction2 = Usercollected2.first();


								const result = getResult(Userreaction.emoji.id, Userreaction2.emoji.id);

								const won1 = new MessageEmbed()
									.setTitle('TAH Results!')
									.setDescription(result)
									.addField('Player 1', `Chose \`${Userreaction.emoji.name}\``, true)
									.addField('Player 2', `Chose \`${Userreaction2.emoji.name}\``, true)
									.setColor(message.member.displayHexColor)
									.setThumbnail(message.author.displayAvatarURL());
								gameStartMsg.edit('', won1);

							}
							catch(e) {
								return gameStartMsg.edit(new MessageEmbed()
									.setTitle('<:tank:724255516603449356> Match cancelled!')
									.setDescription(`<@${member}> either has their DM's disabled or didn't react in time.`)
									.setColor(colours.red));
							}
						}
						catch(e) {
							return gameStartMsg.edit(new MessageEmbed()
								.setTitle('<:tank:724255516603449356> Match cancelled!')
								.setDescription(`<@${message.author.id}> either has their DM's disabled or didn't react in time.`)
								.setColor(colours.red));
						}
					}
				}
				catch(e) {
					await gameStartMsg.reactions.removeAll();
					return gameStartMsg.edit(new MessageEmbed()
						.setTitle('<:tank:724255516603449356> Match cancelled!')
						.setDescription(`<@${member}> didn't choose an option for the invitation.`)
						.setColor(colours.red));
				}
			}
			else {
				return message.channel.send('That is not an option.');
			}
		}
		catch (e) {
			return message.channel.send('Didnt pick AI or user in time');
		}
	},
};