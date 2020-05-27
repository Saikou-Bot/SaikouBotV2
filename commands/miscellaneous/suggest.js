const colours = require('../../colours.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
    config: {
        name: 'suggest',
        description: 'Lets you suggest in suggestions.',
        usage: '.suggest <suggestion>',
        accessableby: 'Public',
        aliases: ['suggestion']
    },
    run: async (bot, message, args) => {


        let suggestion = args.join(" ")

        if (!suggestion) return message.channel.send("Suggest something then idiot")

        const suggestEmbed = new MessageEmbed()
            .setTitle(`Suggestion #1`)
            .setDescription(suggestion)
            .setColor(colours.blurple)
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())

        message.channel.send(suggestEmbed)

    }
}