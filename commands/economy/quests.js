const userQuests = require('../../models/userQuests');


module.exports = {
	config: {
		name: 'quests',
		description: 'See which quests you are currently doing!',
		usage: '.quests',
		accessableby: 'Followers+',
		aliases: ['viewquests', 'activequests'],
		channel: 'bot-commands'
	},
	run: async ({ client: bot, message }) => {


		const currentQuests = userQuests.find({ UserID: message.author.id, completed: false });

		const embed = new MessageEmbed()
			.setTitle('🛡️ Current Quests')
			.setDescription('All your currently active quests are listed here.')
			.setColor(message.member.displayHexColor)


            ; (await currentQuests).forEach(r => {
			embed.addField(`${r.Quest} ─ ${r.Difficulty}`, `${r.Description}\n\`REWARD\` **${r.Reward.toLocaleString()}** credits`);
		});

		message.channel.send(embed);


	},
};
