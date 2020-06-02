const { MessageEmbed } = require('discord.js');
const creditsData = require('../../models/userData.js');
const find = require('../../jsonFiles/find.json');


module.exports = {
    config: {
        name: 'find',
        description: 'Looking to earn some extra credits? This command will allow you to get a few extra!',
        usage: '.skillrate / .skillrate <user>',
        accessableby: 'Public',
        aliases: ['beg', 'look'],
    },
    run: async (bot, message) => {

        const findMessage = find[Math.floor((Math.random() * find.length))];

        creditsData.findOne({ userID: message.author.id }, (err, creditData) => {
            if (err) console.log(err);

            creditData.coins += findMessage.credits;
            creditData.save();

            const Embed = new MessageEmbed()
                .setTitle('🔍 Find Outcome!')
                .addField('Location:', findMessage.location)
                .addField('Outcome:', findMessage.message)
                .setColor(message.member.displayHexColor)
                .setThumbnail(message.author.displayAvatarURL())
                .setFooter(`Found by ${message.author.tag}`, message.author.displayAvatarURL())
                .setTimestamp();

            message.channel.send(Embed);

        });

    },
};