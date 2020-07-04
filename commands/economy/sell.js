const userItems = require('../../models/userItems');
const credits = require('../../models/userData');
const { MessageEmbed } = require('discord.js');
const colours = require('../../jsonFiles/colours.json');


module.exports = {
	config: {
		name: 'sell',
		description: 'Sell an item if you are low on cash.',
		usage: '.sell <item>',
		accessableby: 'Followers+',
		aliases: ['sellitem'],
		channel: 'bot-commands'
	},
	run: async ({ client: bot, message, args }) => {


		const Name = args.join(' ');


		credits.findOne({ userID: message.author.id }, (err, userCredits) => {

			userItems.findOne({ userID: message.author.id, itemName : { $regex: Name, $options: 'i' } }, (err, Items) => {

				if (!Items) {
					return message.channel.send(new MessageEmbed()
						.setTitle('📁 Can\'t find item!')
						.setDescription('That item either isn\'t in your inventory or doesn\'t exist!')
						.setColor(colours.red));
				}

				if (Items.itemQuantity > 1) {
					userCredits.coins += Items.itemSell;
					userCredits.save();

					Items.itemQuantity -= 1;
					Items.save();

					return message.channel.send(new MessageEmbed()
						.setTitle('🚚 Success!')
						.setDescription(`You successfully sold **${Items.itemName}** in the Military Market for \`S$${Items.itemSell.toLocaleString()}\`.`)
						.setColor(colours.green));
				}

				else {
					userItems.deleteOne({ userID: message.author.id, itemName : { $regex: Name, $options: 'i' } }, () => {


						userCredits.coins += Items.itemSell;
						userCredits.save();


						return message.channel.send(new MessageEmbed()
							.setTitle('🚚 Success!')
							.setDescription(`You successfully sold **${Items.itemName}** in the Military Market for \`S$${Items.itemSell.toLocaleString()}\`.`)
							.setColor(colours.green));

					});
				}

			});

		});


	},
};
