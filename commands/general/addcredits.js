const { MessageEmbed } = require('discord.js');
const UserData = require('../../models/userData.js');
const errors = require('../utils/embeds');
const { getUserMod } = require('../utils/getUserMod');
const colours = require('../../jsonFiles/colours.json');

module.exports = {
	config: {
		name: 'addcredits',
		description: 'Adds credits to a users balance.',
		usage: '.addcredits <user> <amount>',
		accessableby: 'Staff',
		aliases: ['addcreds'],
	},
	run: async ({ client: bot, message, args }) => {

		const member = getUserMod(message, args[0]);
		const amount = parseInt(args[1]);

		if (!message.member.hasPermission('KICK_MEMBERS')) {
			return message.channel.send('This command is limited to staff only.');
		}

		if (!member) {
			return errors.noUser(message, 'addcredits');
		}

		if (member.id === message.author.id) {
			return errors.yourself(message, 'addcredits');
		}

		if (!amount) {
			return message.channel.send(new MessageEmbed()
				.setTitle('🚫 No amount specified')
				.setDescription(`Please specify an amount to give to **${member.displayName}**`)
				.setColor(colours.red));
		}

		if (message.content.includes('-')) {

			const negative = new MessageEmbed()
				.setTitle('🚫 Cant add negatives!')
				.setDescription('You cannot add negative amounts to users, try again and type a positive number!')
				.setColor(colours.red);

			return message.channel.send(negative);

		}

		UserData.findOne({
			userID: member.id,
		}, (err, userData) => {

			if (!userData) {
				const newData = new UserData({
					username: member.user.username,
					userID: member.id,
					lb: 'all',
					coins: amount,
					medals: 0,
					items: [{ itemName: 'Wooden Walls', itemID: 'WoodenWall', itemQuantity: 1, itemSell: 0, itemEmoji: '<:WoodenWall:716625054351360010>', itemType: 'Wall Defence' }],
				});
				newData.save().catch(err => console.log(err));

				message.channel.send(new MessageEmbed()
					.setTitle('✅ Added credits')
					.setDescription(`Successfully added **${amount}** credits to ${member.displayName}`)
					.setColor(colours.green));


			}
			else {
				userData.coins += amount;
				userData.save();

				message.channel.send(new MessageEmbed()
					.setTitle('✅ Added credits')
					.setDescription(`Successfully added **${amount}** credits to ${member.displayName}`)
					.setColor(colours.green));
			}

		});

	},
};
