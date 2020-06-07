const { MessageEmbed } = require('discord.js');
const { getMember } = require('../utils/getMember');

module.exports = {
    config: {
        name: 'skillrate',
        description: 'Looking to find how pro you really are? Let this command decide for you!',
        usage: '.skillrate || .skillrate <user>',
        accessableby: 'Followers+',
        aliases: ['prorate', 'skill', 'pro', 'rate'],
    },
    run: async (bot, message, args) => {

        const member = getMember(message, args.join(' '));
        const rating = Math.floor(Math.random() * 101);

        const skillrateEmbed = new MessageEmbed()
            .setTitle('Skill Rating')
            .setDescription(`**${member.displayName}** is \`%${rating}\` skilled! 🏆`)
            .setColor(member.displayHexColor);

        message.channel.send(skillrateEmbed);

    },
};