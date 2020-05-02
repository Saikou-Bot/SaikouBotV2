module.exports = (client, message) => {
const { MessageEmbed } = require('discord.js')
const Colour = require('../../colours.json')

 if (message.channel.name == "👥management") return;
 if (message.channel.name == "🔧project-untitled") return;
 if (message.channel.name == "🔒classified") return;
 if (message.author.bot) return;
 if (message.content.length > 1900) return;

if(message.attachments.size > 0) {

    const attachmentlogembed = new MessageEmbed()
    .setTitle(':warning: Warning!')
    .setColor(Colour.yellow)
    .setDescription(`**Attachment sent by <@${message.author.id}> was deleted in ${message.channel}**`)
    .setFooter(`User ID: ${message.author.id}`)
    .setTimestamp();

    if(message.content) {
        attachmentlogembed.addField('Message Content', message.content, true)
    }

    client.channels.cache.get('409832539360854019').send(attachmentlogembed);

} else {

const logembed = new MessageEmbed()
.setTitle(':warning: Warning!')
.setColor(Colour.yellow)
.setDescription(`**Message sent by <@${message.author.id}> was deleted in ${message.channel}**\n${message.content}`)
.setFooter(`User ID: ${message.author.id}`)
.setTimestamp();


client.channels.cache.get('409832539360854019').send(logembed);

}};

