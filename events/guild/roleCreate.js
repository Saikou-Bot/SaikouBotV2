const { GuildMemberRoleManager } = require('discord.js');

module.exports = (client, role) => {
	const Colour = require('../../jsonFiles/colours.json');

	modLogs.send(new MessageEmbed()
		.setTitle(':information_source: New Role!')
		.setColor(Colour.blurple)
		.setDescription(`**Role Created: ${role.name}**`)
		.setFooter(`Role ID: ${role.id}`)
		.setTimestamp());


};