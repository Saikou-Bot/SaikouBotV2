const { MessageEmbed } = require('discord.js');
const colours = require('../../jsonFiles/colours.json');


module.exports = {
    config: {
        name: 'ping',
        description: 'Displays bot and API latency.',
        usage: '.ping/latency',
        accessableby: 'Public',
        aliases: ['latency'],
    },
    run: async (client, message) => {

        const pinging = new MessageEmbed()
            .setTitle('🏓 Pinging...')
            .setDescription('Fetching bot and API latency!')
            .setColor(colours.blurple);

        const msg = await message.channel.send(pinging);
        //    const botLatency = msg.createdTimestamp - message.createdTimestamp;

        const replies = ['Here you go! I hope it\'s okay...', 'Successfully fetched bot and API latency.', 'There you go! Is it bad...?'];
        const result = Math.floor((Math.random() * replies.length));

        const latencyEmbed = new MessageEmbed()
            .setTitle('🏓 Pong!')
            .setDescription(replies[result])
            .addField('Bot Latency:', `${msg.createdTimestamp - message.createdTimestamp}ms`, true)
            .addField('API Latency:', `${client.ws.ping}ms`, true)
            .setColor(colours.blurple);

        msg.edit(latencyEmbed);


    },
};
