const { MessageEmbed } = require('discord.js');
const colours = require('../../jsonFiles/colours.json');

module.exports = {
    config: {
        name: 'status',
        description: 'Looking to find how pro you really are? Let this command decide for you!',
        usage: '.skillrate / .skillrate <user>',
        accessableby: 'Public',
        aliases: ['prorate', 'skill', 'pro', 'rate'],
    },
    run: async (bot, message) => {

        const msg = await message.channel.send(new MessageEmbed()
            .setDescription('Loading...')
            .setColor(colours.blurple));

        const botLatency = msg.createdTimestamp - message.createdTimestamp;
        const MemoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
        let statusMsg = '';

        function duration(ms) {
            const sec = Math.floor((ms / 1000) % 60).toString();
            const min = Math.floor((ms / (1000 * 60)) % 60).toString();
            const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
            return `${hrs.padStart(2, '0')} hrs, ${min.padStart(2, '0')} mins, ${sec.padStart(2, '0')} secs `;
        }

        const status = new MessageEmbed()
            .setTitle('Saikou Bot Status')
            .setDescription(`**${bot.user.username}** has been running for \`${duration(bot.uptime)}\`\nDown below lists some statistics.\n\n**Bot Latency:** \`${botLatency}ms\`\n\n**Memory Usage:** \`${Math.round(MemoryUsage)}%\` `)
            .setThumbnail(bot.user.displayAvatarURL());

        if (botLatency > 199 && botLatency < 600) {
            status.setColor(colours.yellow);
            statusMsg = '⚠️ Higher than average bot latency.';
        }
        else if (botLatency > 0 && botLatency < 200) {
            status.setColor(colours.green);
            statusMsg = '✅ Normal bot latency.';
        }
        else if (botLatency > 599 && botLatency < 999999999) {
            status.setColor(colours.red);
            statusMsg = '❗ Extremely high bot latency.';
        }
        else {
            status.setColor(colours.green);
            statusMsg = '✅ Normal bot latency.';
        }

        status.addField('Acknowledgements', statusMsg);

        msg.edit(status);


    },
};