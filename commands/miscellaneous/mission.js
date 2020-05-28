const colours = require('../../jsonFiles/colours.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
    config: {
        name: 'mission',
        description: 'Gives you a mission you can do in Military Warfare Tycoon if you are running out of ideas!',
        usage: '.mission',
        accessableby: 'Public',
        aliases: ['quest']
    },
    run: async (bot, message, args) => {

        const missions = require("../../jsonFiles/mission.json")

        let pickedMission = Math.floor((Math.random() * missions.length));

        const MissionEmbed = new MessageEmbed()
            .setTitle(`Here's your mission Soldier...`)
            .setDescription(missions[pickedMission])
            .setColor(colours.blurple)
            .setTimestamp()
            .setFooter("Your mission")
            .setThumbnail(message.author.displayAvatarURL())

        message.channel.send(MissionEmbed)

    }
}