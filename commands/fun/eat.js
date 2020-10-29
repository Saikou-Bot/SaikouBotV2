const Cooldown = require('../../utils/cooldown').construct();

const ms = require('ms');

function ceilSecond(timestamp) {
	return Math.ceil(timestamp / 1000) * 1000;
}

class EatCooldown extends Cooldown {
	embed(userid) {
		const { timestamp, role, roleEffect, end } = this.users.get(userid);
		const leftMs = ceilSecond(end - Date.now());
		const left = ms(leftMs, {
			long: true,
		});
		return new MessageEmbed({
			title: '🐌 Woah there, slow down, too much candies for today!',
			description: `You must wait **${left}** before getting another sugar rush.`,
		}).setColor(colours.red);
	}
}

const CandyData = require('../../models/candies');

const command = {
	config: {
		name: 'eat',
		arguments: {
			candyName: true,
			amount: false,
		},
	},
	async run({ message, args, utils: { shorten } }) {
		let candyData = await CandyData.findOne({ userID: message.author.id });

		if (!candyData || candyData.amount == 0) {
			return message.channel.send(
				new discord.MessageEmbed({
					title: 'You do not have enough candies',
					description: 'You have **0** candies, trick or treat to get candies',
					color: colours.red,
				})
			);
		}

		const amount = args.amount || 1;
		if (isNaN(amount)) {
			return message.channel.send(
				new discord.MessageEmbed({
					title: '🔢 Not a number!',
					description: `\`${args.amount}\` is not a number`,
					color: colours.red,
				})
			);
		}

		if (candyData.amount < amount) {
			return message.channel.send(
				new discord.MessageEmbed({
					title: 'You do not have enough candies',
					description: `You have **${candyData.amount}** candies, and you need **${amount - candyData.amount}** more candies`,
					color: colours.red,
				})
			);
		}

		this.cooldown.add(message.member);

		candyData = await candyData.updateOne({ $inc: { 'amount': -Math.abs(amount) } }, { new: true });

		console.log(candyData)

		return message.channel.send(new MessageEmbed()
			.setTitle(`🍬 You ate ${shorten(args.candyName, 50)}!`)
			.setDescription(`You filled your stomach with **${amount}** ${shorten(args.candyName, 50)}! You have **${candyData.amount}** candies left.`)
			.setFooter('Gain some candies with .trickortreat')
			.setColor(colours.orange));
	},
};

command.cooldown = new EatCooldown({
	name: 'eat',
	// cooldown: 12 * 60 * 60 * 1000
});

module.exports = command;
