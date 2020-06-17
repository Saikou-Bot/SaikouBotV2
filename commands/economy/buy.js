const { MessageEmbed } = require('discord.js');
const UserData = require('../../models/userData.js');
const userItems = require('../../models/userItems');
const items = require('../../models/items');
const errors = require('../utils/embeds');
const colours = require('../../jsonFiles/colours.json');

module.exports = {
	config: {
		name: 'buy',
		description: 'Purchase an item in the shop.',
		usage: '?buy itemName',
		accessableby: 'Followers+',
		aliases: ['purchase'],
	},
	run: async (bot, message, args) => {

		const ItemName = args.join(' ');

		const InvalidItem = new MessageEmbed()
			.setTitle('🔎 Item doesn\'t exist!')
			.setDescription('Please specify a valid item to buy, for a list of items you can do `.shop`')
			.setColor(colours.red)
			.setFooter('Invalid item')
			.setTimestamp();

		if (!ItemName) {
			return message.channel.send(InvalidItem);
		}

		const shopItems = await items.findOne({ name: ItemName, inshop: true });

		if (!shopItems) {
			return message.channel.send(InvalidItem);
		}

		const itemFiles = bot.items.get(shopItems.name);
		if (typeof itemFiles === 'undefined') {
			return;
		}


		else {
			UserData.findOne({ userID: message.author.id }, (err, userData) => {

				if (!userData) {
					const newData = new UserData({
						username: message.author.username,
						userID: message.author.id,
						lb: 'all',
						coins: 0,
						medals: 0,
					});
					newData.save().catch(err => console.log(err));

					return errors.noCoins(message, `${itemFiles.name}` || message, `${itemFiles.price.toLocaleString()}`);
				}

				else if (userData.coins < itemFiles.price) {
					return errors.noCoins(message, `${itemFiles.name}` || message, `${itemFiles.price.toLocaleString()}`);
				}

				userItems.findOne({ userID: message.author.id, itemName: itemFiles.name }, (err, itemData) => {
					if (err) console.log(err);

					if (!itemData) {

						userItems.create(
							{
								username: message.author.username,
								userID: message.author.id,
								itemName: itemFiles.name,
								itemQuantity: 1,
								itemSell: Math.floor(itemFiles.price / 2),
								itemEmoji: itemFiles.emoji,
								itemType: itemFiles.type,
								multipurchase: itemFiles.multipurchase,

							});

						userData.coins -= itemFiles.price;
						userData.save();

						errors.bought(message, `${itemFiles.name}` || message, `${itemFiles.price.toLocaleString()}`);

					}
					else {

						if (itemData.multipurchase === false) {
							return message.channel.send('You can only have one of this item.');
						}

						console.log(itemData.multipurchase);

						userItems.updateOne(
							{ userID: message.author.id, itemName: itemFiles.name }, { $inc: { itemQuantity: 1 } }, () => {
								userData.coins -= itemFiles.price;
								userData.save();

								errors.bought(message, `${itemFiles.name}` || message, `${itemFiles.price.toLocaleString()}`);

							});
					}
				});
			});
		}
	},
};