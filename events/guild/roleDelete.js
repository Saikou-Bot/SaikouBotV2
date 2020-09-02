module.exports = (client, role) => {
	const Colour = require('../../jsonFiles/colours.json');

	modLogs.send(new MessageEmbed()
		.setTitle(':information_source: Deleted Role!')
		.setColor(Colour.red)
		.setDescription(`**Role Deleted: ${role.name}**`)
		.setFooter(`Role ID: ${role.id}`)
		.setTimestamp());


};