const { MessageEmbed } = require('discord.js');
const { Constants } = require('../util/Constants');
const { Constants: djsConstants } = require('discord.js');

djsConstants.Colors = Object.assign({}, djsConstants.Colors, Constants.colors);

class SaikouEmbed extends MessageEmbed {
	setup(data, skipValidation) {
		super.setup(Object.assign({}, { color: 7506394 }, data), skipValidation);
	}
}
module.exports = SaikouEmbed;