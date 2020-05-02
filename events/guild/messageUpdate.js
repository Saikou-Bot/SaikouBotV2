module.exports = (client, oldMessage, newMessage, message, member) => {

    const { MessageEmbed } = require('discord.js')

    if (newMessage.author.bot || oldMessage.content == newMessage.content) return;

    const name = newMessage.content.length > 17 ? newMessage.content.substring(0, 10) + '...' : newMessage.content;

    let messageEdit = new MessageEmbed()
        .setTitle(':warning: Warning!')
        .setColor('FFD62F')
        .setDescription(`Message sent by <@${oldMessage.author.id}> edited in ${oldMessage.channel} [Jump to message](${newMessage.url})`)
        .addField('Before', oldMessage.content)
        .addField('After', newMessage.content)
        .setFooter(`User ID: ${oldMessage.author.id}`)
        .setTimestamp();

    client.channels.cache.get('409832539360854019').send(messageEdit);

    // sends the embed

};
