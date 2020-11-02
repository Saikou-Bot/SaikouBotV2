const userData = require('../../models/userData.js');
const userQuests = require('../../models/userQuests');

module.exports = {
	config: {
		name: 'skillrate',
		description: 'Looking to find how pro you really are? Let this command decide for you!',
		usage: '.skillrate || .skillrate <user>',
		accessableby: 'Followers+',
		aliases: ['prorate', 'skill', 'pro', 'rate'],
		channel: 'bot-commands',
		cooldown: true,
		autoCooldown: true,
	},
	async run({
		message,
		argString,
		utils: {
			getMember
		}
	}) {

		const member = getMember(message, argString);
		const rating = Math.round(Math.random() * 100);

		if (rating < 98) return message.channel.send(new MessageEmbed()
			.setTitle('Skill Rating')
			.setDescription(`**${member.displayName}** is \`%${rating}\` skilled! 🏆`)
			.setColor(member.displayHexColor));
		else return message.channel.send(new MessageEmbed()
			.setTitle('🔥 Skill Rating')
			.setDescription(`**${member.displayName}** is 𝐁𝐄𝐘𝐎𝐍𝐃 𝐆𝐎𝐃𝐋𝐈𝐊𝐄! 🏆`)
			.setColor(colours.red));

	},
};