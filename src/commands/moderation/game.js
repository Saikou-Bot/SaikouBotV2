const { Command } = require('discord-akairo');
const SaikouEmbed = require('../../structure/SaikouEmbed');

class Game extends Command {
    constructor() {
        super('game', {
            aliases: ['game', 'gamelog'],
            separator: '|',
            args: [
                {
                    id: 'fields',
                    type: 'string',
                    match: 'separate',
                    limit: 3,
                    otherwise: 'Incorrect usage:\n**.game <player> | <punishment> | <reason>**'
                }
            ]
        })
    }
    async exec(message, { fields }) {

        if (fields.length < 3) {
            return message.channel.send(new SaikouEmbed()
            .setTitle('📋 Incorrect Usage')
            .setDescription('**Command Name:** game\n**Usage:** .game <player> | <punishment> | <reason>')
            .setColor('RED')
            .setFooter('<> - Required ● Optional - [] ')).then(embed => embed.delete({ timeout: 15000 }))
        }

        return message.guild.channels.cache.find(ServerChannel => ServerChannel.name.includes('moderation')).send(new SaikouEmbed()
        .setTitle(`MWT | ${fields[1]}`)
        .addField('User:', `${fields[0]}`, true)
        .addField('Moderator:', `<@${message.author.id}>`, true)
        .addField('Reason:', `${fields[2]}`)
        .setThumbnail('https://t5.rbxcdn.com/c10e24c5d8d434eb0c20aaafd5f67436')
        .setColor('GREEN')
        .setFooter(fields[1])
        .setTimestamp())
}

}
module.exports = Game;