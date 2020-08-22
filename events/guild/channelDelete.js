module.exports = (client, channel) => {
	const Colour = require('../../jsonFiles/colours.json');

	modLogs.send(new MessageEmbed()
		.setTitle(':information_source: Deleted Channel!')
		.setColor(Colour.red)
		.setDescription(`**Channel Deleted: #${channel.name}**`)
		.setFooter(`Channel ID: ${channel.id}`)
		.setTimestamp());


};