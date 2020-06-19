const { MessageEmbed } = require('discord.js');
const UserData = require('../../models/userData.js');
const userItems = require('../../models/userItems');
const items = require('../../models/items');
const errors = require('../utils/embeds');
const colours = require('../../jsonFiles/colours.json');
const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

module.exports = {
	config: {
		name: 'buy',
		description: 'Purchase an item in the shop.',
		usage: '?buy itemName',
		accessableby: 'Followers+',
		aliases: ['purchase'],
		channel: 'bot-commands'
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

		const regex = new RegExp(`.*${ItemName.replace(/(\W)/g, '\\$1')}.*`, 'gi');
		const shopItems = await items.find({ 'name' : regex, inshop: true, });

		let choosenItem;

		if (shopItems.length < 1) {
			return message.channel.send(InvalidItem);
		}

		if (shopItems.length > 1) {
			const choosableItems = shopItems.map((item, index) => {
				return `${index + 1}. ${item.name}`;
			}).join('\n');

			const chooseEmbed = new MessageEmbed({
				title: 'Choose item',
				description: choosableItems
			});

			const reactEmbed = await message.channel.send(chooseEmbed);
			const reactions = [];

			for (let i = 0; i < shopItems.length; i++) {
				const number = numbers[i];
				reactEmbed.react(number);
				reactions.push(number);
			}

			console.log(reactions);

			try {
				const collected = await reactEmbed.awaitReactions((reaction, user) => {
					return user.id === message.author.id && reactions.includes(reaction.emoji.name);
				}, { time: 15000, max: 1, errors: ['time'] });
				reactEmbed.delete();
				choosenItem = shopItems[reactions.indexOf(collected.firstKey())];
			}
			catch (e) {
				console.error(e);
			}
		}
		else {
			choosenItem = shopItems[0];
		}

		const itemFiles = bot.items.get(choosenItem.name);
		if (typeof itemFiles === 'undefined') {
			return;
		}


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
							itemType: itemFiles.category,
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
	},
};
