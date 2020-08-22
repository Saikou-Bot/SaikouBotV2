const messageDelete = require('./messageDelete');

module.exports = (client, channel) => {
	const Colour = require('../../jsonFiles/colours.json');

	modLogs.send(new MessageEmbed()
		.setTitle(':information_source: New Channel!')
		.setColor(Colour.blurple)
		.setDescription(`**Channel Created: #${channel.name}**`)
		.setFooter(`Channel ID: ${channel.id}`)
		.setTimestamp());


};