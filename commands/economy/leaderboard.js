const { MessageEmbed } = require('discord.js');
const userdata = require('../../models/userData');
const colours = require('../../jsonFiles/colours.json');

const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'keycap_ten'];

module.exports = {
	config: {
		name: 'leaderboard',
		description: 'Displays the top 10 users who have the most credits.',
		usage: '.leaderboard',
		accessableby: 'Followers+',
		aliases: ['creditsleaderboard', 'leader', 'credsleaderboard', 'top10', 'lb', 'top'],
	},
	run: async (bot, message) => {

		let description = '';
		let numberName = '';

		const data = userdata.find({ lb: 'all' }).sort([['coins', 'descending']]).limit(10).select('coins userID -_id');


		const leaderboard = new MessageEmbed()
			.setTitle('Credits Leaderboard');

		if (data.length === 0) {
			leaderboard.setDescription('No data found.');
		}

		leaderboard.setColor(colours.blurple);

		(await data).forEach((a, index) => {
			switch (index + 1) {
			case 1: numberName = '🥇'; break;
			case 2: numberName = '🥈'; break;
			case 3: numberName = '🥉'; break;
			default: numberName = `:${numbers[index]}:`; break;
			}
			description += `${numberName} <@${a.userID}> **Credits**: ${a.coins}\n`;
		});

		leaderboard.setDescription(`Displaying the top 10 most rich users\n\n${description}`);


		message.channel.send(leaderboard);


	},
};
