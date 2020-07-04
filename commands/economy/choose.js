const { MessageEmbed } = require('discord.js');
const quests = require('../../models/quests');
const Userquests = require('../../models/userQuests');
const colours = require('../../jsonFiles/colours.json');

module.exports = {
	config: {
		name: 'choose',
		description: 'Choose a quest through this command!',
		usage: '.choose questName',
		accessableby: 'Followers+',
		aliases: ['choosequest', 'start', 'startquest'],
		channel: 'bot-commands'
	},
	run: async ({ client: bot, message, args }) => {


		let QuestName = '';
		let QuestDifficulty = '';
		let QuestDescription = '';
		let reward = 0;

		quests.find({}, (err, questPick) => {

			for (const i in questPick) {
				if (args.join(' ').trim().toUpperCase() === questPick[i].QuestTitle.toUpperCase()) {
					QuestName = questPick[i].QuestTitle;
					QuestDifficulty = questPick[i].Difficulty;
					QuestDescription = questPick[i].Description;
					reward = questPick[i].Reward;

				}
			}


			if (!QuestName.length) {
				return message.channel.send('Quest does not exist!');
			}
			else {

				Userquests.findOne({
					UserID: message.author.id,
					Quest: QuestName,
					completed: true,
				}, (err, chooseQuest) => {

					if (chooseQuest) {
						return message.channel.send(new MessageEmbed()
							.setTitle('❌ Quest Completed')
							.setDescription('You have already completed that quest, please select one that isn\'t currently complete.')
							.setColor(colours.red));
					}

					Userquests.findOne({
						UserID: message.author.id,
						Quest: QuestName,
						completed: false,
					}, (err, multiQuest) => {

						if (multiQuest) {
							return message.channel.send(new MessageEmbed()
								.setTitle('❗ Already started quest')
								.setDescription('You have already started that quest, please select one that isn\'t currently active.')
								.setColor(colours.red));
						}


						if (!chooseQuest) {


							Userquests.create({
								Username: message.author.username,
								UserID: message.author.id,
								Quest: QuestName,
								Difficulty: QuestDifficulty,
								Reward: reward,
								Description: QuestDescription,

							});


							return message.channel.send(new MessageEmbed()
								.setTitle('⚔️ Quest Started!')
								.setDescription(`You have started the quest **${QuestName}** for ${reward.toLocaleString()} credits, here are the details Soldier!`)
								.addField('Mission:', QuestDescription)
								.setColor(colours.green));
						}
					});
				});
			}

		}).select('QuestTitle Difficulty Description Reward ID -_id');


	},
};
