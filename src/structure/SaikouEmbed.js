const { MessageEmbed } = require('discord.js');
const Constants = require('../util/Constants');
const { Constants: djsConstants } = require('discord.js');

djsConstants.Colors = Object.assign({}, djsConstants.Colors, Constants.Colors);

class SaikouEmbed extends MessageEmbed {
	setup(data, skipValidation) {
		super.setup(Object.assign({}, { color: 'BLURPLE' }, data), skipValidation);
	}
	addEmptyField(inline) {
		this.addField('\u200b', '\u200b', inline);
	}
}
module.exports = SaikouEmbed;