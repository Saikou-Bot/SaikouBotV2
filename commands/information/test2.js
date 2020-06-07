
const discord = require('discord.js');

module.exports = {
    config: {
        name: 'test2',
        description: 'Answer questions on Military Warfare Tycoon.',
        usage: '.trivia',
        accessableby: 'Public',
        aliases: ['quiz'],
    },
    run: async (bot, message) => {


        message.author.send('help embed would go here')

        message.author.createDM().then(e => {
            const collector = e.createMessageCollector(u2 => u2.author.id === message.author.id, { time: 15000 });
            collector.on('collect', m => {

                console.log(m.content)
                if (m.content.toLowerCase() === '.help currency') {
                    message.author.send('Works')
                }

                if (m.content.toLowerCase() === 'cancel') {
                    message.channel.send('cancelled')
                    collector.stop()
                }

            });
            collector.on('end', collected => console.log(`Collected ${collected.size} items`));
        })



    },
};