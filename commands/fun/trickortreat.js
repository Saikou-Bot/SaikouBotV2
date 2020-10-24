const MIN_CANDIES = 2;
const MAX_CANDIES = 50;

const candiesRange = MAX_CANDIES - MIN_CANDIES;

function ofCandies(percentage) {
	return (percentage * candiesRange) + MIN_CANDIES;
}

const CandyData = require('../../models/candies');

module.exports = {
	config: {
		name: 'trickortreat',
		cooldown: 6 * 60 * 60 * 1000,
		autoCooldown: true,
		cooldownRoles: { 'Developer': 0 }
	},
	async run({ message }) {
		const candies = Math.floor(Math.random() * (MAX_CANDIES - MIN_CANDIES) + MIN_CANDIES);

		await CandyData.findOneAndUpdate({
			userID: message.author.id
		}, {
			userID: message.author.id,
			$inc: {
				'amount': candies
			}
		}, { upsert: true });

		const ttEmbed = new discord.MessageEmbed({
			title: '🍬 You got treated (idk what to put here)',
			description: `You gained **${candies}** candies!`
		});

		if (ofCandies(0.40) > candies) ttEmbed.setColor(colours.green);
		else if (ofCandies(0.70) > candies) ttEmbed.setColor(colours.blue);
		else ttEmbed.setColor(colours.purple);

		return message.channel.send(ttEmbed);
	}
};