const { CommandHandler, Argument } = require('discord-akairo')

module.exports = function (message, phrase) {
	if (!phrase) return null;

	return (this instanceof CommandHandler ? this : this instanceof Argument ? this.handler : message.client.commandHandler).categories.get(phrase.toLowerCase()) || null;
}