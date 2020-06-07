const {
    MessageEmbed
} = require('discord.js');

module.exports = {
    config: {
        name: 'argstest',
        aliases: ['args'],
        arguments: {
            'test1': true,
            'test2': false
        },
        defaultIncorrectArgs: true
    },
    run(client, message, args) {



    },
    error(type, message) {
        if (type == 'incorrectArguments') {
            message.channel.send(new MessageEmbed({
                title: 'no you are using it incorrect :('
            }));
        }
    }
}