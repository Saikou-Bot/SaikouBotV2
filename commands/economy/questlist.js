const { MessageEmbed } = require('discord.js');
const quests = require('../../models/quests');

module.exports = {
	config: {
		name: 'questlist',
		description: 'Wanting to gain some extra rewards? Pick out a quest and choose from many!',
		usage: '.choose questName',
		accessableby: 'Followers+',
		aliases: ['givequest'],
		channel: 'bot-commands'
	},
	run: async (bot, message) => {

		let i = 0;
		const title = quests.find({}, { limit: 10 }).select('QuestTitle Difficulty Description Reward -_id');


		const embed = new MessageEmbed()
			.setTitle('🛡️ Quest Selection')
			.setDescription('You can do `.choose questName` to select a quest.')
			.setColor(message.member.displayHexColor)

            ; (await title).forEach(r => {
			i++;
			embed.addField(`Quest ${i}`, `**${r.QuestTitle}** ─ ${r.Difficulty}\n${r.Description}\n\`REWARD\` **${r.Reward.toLocaleString()}** credits`);
		});

		message.channel.send(embed);

	},
};