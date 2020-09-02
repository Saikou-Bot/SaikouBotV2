const userData = require('../../models/userData.js');
const userQuests = require('../../models/userQuests');

module.exports = {
	config: {
		name: 'skillrate',
		description: 'Looking to find how pro you really are? Let this command decide for you!',
		usage: '.skillrate || .skillrate <user>',
		accessableby: 'Followers+',
		aliases: ['prorate', 'skill', 'pro', 'rate'],
		channel: 'bot-commands'
	},
	run: async ({ client: bot, message, args, utils: { getMember } }) => {

		const member = getMember(message, args.join(' '));
		const rating = Math.floor(Math.random() * 101);
		const chance = Math.random() * 100;

		if (chance < 91) {
			const skillrateEmbed = new MessageEmbed()
				.setTitle('Skill Rating')
				.setDescription(`**${member.displayName}** is \`%${rating}\` skilled! 🏆`)
				.setColor(member.displayHexColor);

			message.channel.send(skillrateEmbed);
		}

		else {
			const skillrateEmbed = new MessageEmbed()
				.setTitle('🔥 Skill Rating')
				.setDescription(`**${member.displayName}** is 𝐁𝐄𝐘𝐎𝐍𝐃 𝐆𝐎𝐃𝐋𝐈𝐊𝐄! 🏆`)
				.setColor(colours.red);

			message.channel.send(skillrateEmbed);
		}


		userData.findOne({ userID: message.author.id }, (err, UserData) => {

			userQuests.findOne({ UserID: message.author.id, Quest: 'Skilled Fighter', completed: false }, (err, SkilledFighter) => {

				if (rating === 100 && SkilledFighter) {
					message.channel.send(`You completed the quest **Skilled Fighter** and was rewarded ${SkilledFighter.Reward.toLocaleString()} credits.`);

					UserData.coins += SkilledFighter.Reward;

					SkilledFighter.completed = true;
					SkilledFighter.save();


				}
				UserData.save();
			});
		});

	},
};
