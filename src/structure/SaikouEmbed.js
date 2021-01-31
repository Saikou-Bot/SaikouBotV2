const { MessageEmbed } = require('discord.js');

class SaikouEmbed extends MessageEmbed {
	setup(data, skipValidation) {
		super.setup(Object.assign({}, { color: 1710618 }, data), skipValidation);
	}
}
module.exports = SaikouEmbed;