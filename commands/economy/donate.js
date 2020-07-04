const UserData = require('../../models/userData.js');
const { getUserMod } = require('../utils/getUserMod');
const userQuests = require('../../models/userQuests');
const errors = embeds;


module.exports = {
	config: {
		name: 'donate',
		description: 'Feeling generous? Donate to your fellow friends and help them out!',
		usage: '?donate <user> <amount>',
		accessableby: 'Followers+',
		aliases: ['give'],
		channel: 'bot-commands'
	},
	run: async ({ client: bot, message, args }) => {

		const member = getUserMod(message, args[0]);
		const amount = parseInt(args[1]);

		if (!member) {
			return errors.noUser(message, 'donate');
		}

		if (member.id === message.author.id) {
			return errors.yourself(message, 'donate');
		}

		if (!amount) {
			return message.channel.send(new MessageEmbed()
				.setTitle('🚫 No amount specified')
				.setDescription(`Please specify an amount to donate to **${member.displayName}**`)
				.setColor(colours.red));
		}

		if (message.content.includes('-')) {

			const negative = new MessageEmbed()
				.setTitle('🚫 Cant donate negatives!')
				.setDescription('You cannot donate negative amounts to users, try again and type a positive number!')
				.setColor(colours.red);

			return message.channel.send(negative);

		}


		UserData.findOne({
			userID: message.author.id,
		}, (err, userData) => {
			if (err) console.log(err);

			if (!userData) {
				const newData = new UserData({
					username: message.author.username,
					userID: message.author.id,
					lb: 'all',
					coins: 0,
					medals: 0,
					items: [{ itemName: 'Wooden Walls', itemID: 'WoodenWall', itemQuantity: 1, itemSell: 0, itemEmoji: '<:WoodenWall:716625054351360010>', itemType: 'Wall Defence' }],
				});
				newData.save().catch(err => console.log(err));

				return message.channel.send(new MessageEmbed()
					.setTitle('❗ No money to donate with')
					.setDescription('You have no money to donate with, try earning some and come back again!')
					.setColor(colours.red));

			}
			else {

				if (userData.coins < amount) {

					const high = new MessageEmbed()
						.setTitle('❗ Donation too high')
						.setDescription('You don\'t have the specified amount of coins you are trying to donate!')
						.setColor(colours.red);

					return message.channel.send(high);
				}

				//  UserData.findOne({ userID: member.id });

				UserData.findOne({
					userID: member.id,
				}, (err, userBal) => {
					if (err) console.log(err);


					if (!userBal) {
						if (amount < 50 || amount > 500) {

							const incorrectamount = new MessageEmbed()
								.setTitle('❌ Unable to donate amount!')
								.setDescription('You can\'t donate less than **50** or more than **500**.')
								.setColor(colours.red);

							return message.channel.send(incorrectamount);
						}

						const newBal = new UserData({
							username: member.user.username,
							userID: member.id,
							lb: 'all',
							coins: amount,
							medals: 0,
							items: [{ itemName: 'Wooden Walls', itemID: 'WoodenWall', itemQuantity: 1, itemSell: 0, itemEmoji: '<:WoodenWall:716625054351360010>', itemType: 'Wall Defence' }],
						});
						newBal.save().catch(err => console.log(err));


						const embed = new MessageEmbed()
							.setTitle('Donation Successful!')
							.setDescription(`Your troops have sent a convoy transporting \`${amount.toLocaleString()}\` credits to **${member.displayName}'s** base!`)
							.setColor(colours.green);

						return message.channel.send(embed);
					}
					else {

						let max = new Number();

						if (userBal.coins > 0 && userBal.coins < 1000) { max += 500; }
						else if (userBal.coins > 999 && userBal.coins < 10000) { max += 1000; }
						else if (userBal.coins > 9999 && userBal.coins < 50000) { max += 5000; }
						else if (userBal.coins > 49999 && userBal.coins < 150000) { max += 15000; }
						else if (userBal.coins > 149999 && userBal.coins < 500000) { max += 50000; }
						else if (userBal.coins > 499999 && userBal.coins < 1000000) { max += 100000; }
						else if (userBal.coins > 999999 && userBal.coins < 1999999999) { max += 250000; }
						else { max += 500; }

						if (amount < 50 || amount > max) {

							const incorrectamount = new MessageEmbed()
								.setTitle('❌ Unable to donate amount!')
								.setDescription(`You can't donate less than **50** or more than **${max}**.`)
								.setColor(colours.red);

							return message.channel.send(incorrectamount);
						}

						userBal.coins += amount;
						userBal.save();

						userData.coins -= amount;
						// userData.save();

						const embed = new MessageEmbed()
							.setTitle('Donation Successful!')
							.setDescription(`Your troops have sent a convoy transporting \`${amount.toLocaleString()}\` credits to **${member.displayName}'s** base!`)
							.setColor(colours.green);

						message.channel.send(embed);


						userQuests.findOne({ UserID: message.author.id, Quest: 'Generous Friend', completed: false }, (err, GenerousFriend) => {

							if (amount >= 500 && GenerousFriend) {
								message.channel.send(`You completed the quest **Generous Friend** and was rewarded ${GenerousFriend.Reward.toLocaleString()} credits.`);

								userData.coins += GenerousFriend.Reward;

								GenerousFriend.completed = true;
								GenerousFriend.save();


							}
							userData.save();
						});

					}

				});
			}


		});


	},
};
