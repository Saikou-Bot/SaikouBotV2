const messageDelete = require('./messageDelete');

module.exports = (client, channel) => {
	const Colour = require('../../data/colours.json');

	if (channel.type === 'dm') return;

	modLogs.send(new MessageEmbed()
		.setTitle(':information_source: New Channel!')
		.setColor(Colour.blurple)
		.setDescription(`**Channel Created: #${channel.name}**`)
		.setFooter(`Channel ID: ${channel.id}`)
		.setTimestamp());


};