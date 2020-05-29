const colours = require('../../jsonFiles/colours.json')
const moment = require("moment")
const { MessageEmbed } = require('discord.js')

module.exports = {
    config: {
        name: 'serverinfo',
        description: 'Shows the server statistics.',
        usage: '.serverinfo',
        accessableby: 'Public',
        aliases: ['server', 'guild', 'guildinfo']
    },
    run: async (bot, message, args) => {

        let icon = message.guild.iconURL({ size: 2048 });

        let region = {
            "brazil": "Brazil",
            "eu-central": "Central Europe",
            "singapore": "Singapore",
            "london": "London",
            "russia": "Russia",
            "japan": "Japan",
            "hongkong": "Hongkong",
            "sydney": "Sydney",
            "us-central": "U.S. Central",
            "us-east": "U.S. East",
            "us-south": "U.S. South",
            "us-west": "U.S. West",
            "eu-west": "Western Europe"
        }

        let channels = message.guild.channels;


        const serverinfo = new MessageEmbed()
            .setAuthor(message.guild.name, icon)
            .addField(`Owner:`, message.guild.owner.user.tag, true)
            .addField(`Region`, region[message.guild.region], true)
            .addField(`Members`, message.guild.memberCount, true)
            .addField(`Online`, message.guild.members.cache.filter(mem => mem.presence.status != "offline").size, true)
            .addField(`Bots`, message.guild.members.cache.filter(mem => mem.user.bot === true).size, true)
            .addField(`Channels [${channels.cache.size}]`, `Text - ${channels.cache.filter(r => r.type === "text").size}\nVoice - ${channels.cache.filter(r => r.type === "voice").size}\n Categories - ${channels.cache.filter(r => r.type === "category").size}`, true)
            .addField(`Role List [${message.guild.roles.cache.size - 1}]`, message.guild.roles.cache.map(r => r).join(" ").replace("@everyone", " "))
            .setFooter(`Server ID: ${message.guild.id} | Server Created: ${moment.utc(message.guild.createdAt).format("MMMM Do YYYY")}`)
            .setColor(colours.blurple)

        message.channel.send(serverinfo)





    }
}