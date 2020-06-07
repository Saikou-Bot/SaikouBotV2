const colours = require('../../jsonFiles/colours.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'suggest',
        description: 'Lets you suggest in suggestions.',
        usage: '.suggest <suggestion>',
        accessableby: 'Followers+',
        aliases: ['suggestion'],
    },
    run: async (bot, message, args) => {


        const suggestion = args.join(' ');
        const shortenMessage = suggestion.length > 1900 ? suggestion.substring(0, 1800) + '...' : suggestion;

        const words = new MessageEmbed()
            .setTitle('📜 Not enough words!')
            .setDescription('Your suggestion must contain at least **15** or more letters before being able to have it posted.')
            .setColor(colours.red)
            .setFooter('Incorrect word amount')
            .setTimestamp();

        if (suggestion.length < 15) return message.channel.send(words).then(msg => { msg.delete({ timeout: 15000 }); });


        const suggestEmbed = new MessageEmbed()
            .setTitle('Suggestion #1')
            .setDescription(shortenMessage)
            .setColor(colours.blurple)
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp();

        message.channel.send(suggestEmbed).then(reactWith => {
            reactWith.react('⬆️');
            setTimeout(() => { reactWith.react('⬇️'); }, 500);
            message.delete();

        });

    },
};