const quests = require('../../models/quests');

module.exports = {
    config: {
        name: 'removequest',
        description: 'Adds a quest to the list!',
        usage: '.addquest <QuestTitle> <difficulty> <reward> <description>',
        accessableby: 'Bot Developer',
        aliases: ['removal'],
    },
    run: async (bot, message, args) => {

        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return message.channel.send('This command is limited to bot developers only.');
        }

        const questName = args.join(' ');

        if (!questName) {
            return message.channel.send('Input a quest to remove');
        }

        quests.findOne({ QuestTitle: questName }, (err, quest) => {

            if (!quest) {
                return message.channel.send('That quest does not exist!');
            }

            quests.deleteOne({ QuestTitle: questName }).then(
                message.channel.send('Quest Deleted!'),
            );

        });

    },
};