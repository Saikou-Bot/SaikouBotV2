const quests = require('../../models/quests');

module.exports = {
    config: {
        name: 'addquest',
        description: 'Adds a quest to the list!',
        usage: '.addquest <QuestTitle> <difficulty> <reward> <description>',
        accessableby: 'Bot Developer',
        aliases: [],
    },
    run: async (bot, message, args) => {

        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return message.channel.send('This command is limited to bot developers only.');
        }

        const title = args.join(' ').split(', ')[0];
        const difficulty = args.join(' ').split(', ')[1];
        const reward = args.join(' ').split(', ')[2];
        const description = args.join(' ').split(', ')[3];


        if (!title) {
            return message.channel.send('Input a title');
        }


        if (!difficulty) {
            return message.channel.send('Input a difficulty');
        }

        if (!Number(reward)) {
            return message.channel.send('Input a reward that is numbers only!');
        }


        if (!description) {
            return message.channel.send('Input a desc');
        }

        quests.create({
            QuestTitle: title,
            Difficulty: difficulty,
            Reward: Number(reward),
            Description: description,
        })
            .then(message.channel.send('Quest Added!'));


    },
};