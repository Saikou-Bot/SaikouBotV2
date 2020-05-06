const { MessageEmbed } = require('discord.js')
const colours = require('../../colours.json')



module.exports.noCoins = (message, name, cost) => {
    let embed = new MessageEmbed()
        .setTitle(`💰 Insufficent funds!`)
        .setDescription(`You need at least \`S$${cost}\` to buy **${name}**!`)
        .setColor(colours.red)
        .setFooter(`Insufficent Funds!`)
        .setTimestamp()
    // sends the embed
    message.channel.send(embed).then(message => { message.delete({ timeout: 15000 }) })
};