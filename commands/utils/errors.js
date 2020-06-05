const { MessageEmbed } = require('discord.js');
const colours = require('../../jsonFiles/colours.json');


module.exports.noCoins = (message, name, cost) => {
    const embed = new MessageEmbed()
        .setTitle('💰 Insufficent funds!')
        .setDescription(`You need at least \`S$${cost}\` to buy **${name}**!`)
        .setColor(colours.red)
        .setFooter('Insufficent Funds!')
        .setTimestamp();
    // sends the embed
    message.channel.send(embed);
},


    module.exports.noUser = (message, name) => {
        const embed = new MessageEmbed()
            .setTitle('🔍 Unable to find User!')
            .setDescription(`Please provide a valid user to **${name}**!`)
            .setColor(colours.red)
            .setFooter('No user!')
            .setTimestamp();
        // sends the embed
        message.channel.send(embed);
    },


    module.exports.noReason = (message, name) => {
        const embed = new MessageEmbed()
            .setTitle('📝 No reason provided!')
            .setDescription(`Please provide a reason to **${name}** the user!`)
            .setColor(colours.red)
            .setFooter('No reason!')
            .setTimestamp();
        // sends the embed
        message.channel.send(embed);
    };