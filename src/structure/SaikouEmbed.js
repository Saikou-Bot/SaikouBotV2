const { MessageEmbed } = require('discord.js');

class SaikouEmbed extends MessageEmbed {
	setup(data, skipValidation) {
		super.setup(Object.assign({}, { color: 7506394 }, data), skipValidation);
	}
}
module.exports = SaikouEmbed;