const MIN_CANDIES = 2;
const MAX_CANDIES = 50;

const candiesRange = MAX_CANDIES - MIN_CANDIES;

function ofCandies(percentage) {
	return percentage * candiesRange + MIN_CANDIES;
}

const CandyData = require('../../models/candies');

module.exports = {
	config: {
		name: 'trickortreat',
		cooldown: 6 * 60 * 60 * 1000,
		autoCooldown: true,
		aliases: ['tt']
	},
	async run({ message }) {
		const candies = Math.floor(Math.random() * (MAX_CANDIES - MIN_CANDIES) + MIN_CANDIES);

		await CandyData.findOneAndUpdate(
			{
				userID: message.author.id,
			},
			{
				userID: message.author.id,
				$inc: {
					amount: candies,
				},
			},
			{ upsert: true }
		);

		const ttEmbed = new discord.MessageEmbed()
			.setTitle('🎃 Trick or treat!')
			.setDescription(`You went trick or treating and received **${candies}** candies.`)
			.setFooter('You can eat your candies with .eat');

		if (ofCandies(0.4) > candies) ttEmbed.setColor(colours.green);
		else if (ofCandies(0.7) > candies) ttEmbed.setColor(colours.purple);
		else ttEmbed.setColor(colours.orange);

		return message.channel.send(ttEmbed);
	},
};
