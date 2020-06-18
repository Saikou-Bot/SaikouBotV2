const Items = require('../../models/userItems');
const { MessageEmbed } = require('discord.js');
const { getMember } = require('../utils/getMember');

module.exports = {
	config: {
		name: 'inventory',
		description: 'Shows a users inventory.',
		usage: '.inventory',
		accessableby: 'Followers+',
		aliases: ['inv'],
	},
	run: async (bot, message, args) => {

		const user = getMember(message, args.join(' '));

		Items.find({ userID: user.id }, (err, userItems) => {

			// console.log(userItems)

			if (!userItems.length) {
				return message.channel.send(new MessageEmbed()
					.setDescription(`ℹ️ ${user.displayName} has no items.`)
					.setColor(user.displayHexColor));
			}
			else {
				let invdesc = '';

				const embed = new MessageEmbed()
					.setTitle(`${user.displayName}'s inventory`)
					.setDescription('All your owned items are stored here! Check them out and maybe use one or two with `.use itemName`\n\n')
					.setColor(user.displayHexColor);


				userItems.forEach(a => {
					invdesc += `${a.itemEmoji} **x ${a.itemQuantity}** **∙** \`${a.itemName}\` **-** ${a.itemType}\nSells for: S$${a.itemSell.toLocaleString()}\n\n`;
				});

				embed.addField('Your items:', invdesc);

				message.channel.send(embed);
			}


		})



	},
};