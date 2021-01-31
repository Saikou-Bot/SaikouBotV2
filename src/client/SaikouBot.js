const { AkairoClient, CommandHandler } = require('discord-akairo');

class SaikouBot extends AkairoClient {
    constructor(options) {
        options = Object.assign({}, {
            ownerID: ['670588428970098708', '229142187382669312'],
            intents: 513
        }, options);

        super(options);

        this.commandHandler = new CommandHandler({
            directory: __dirname + '../commands'
        });
    }
}
module.exports = SaikouBot;