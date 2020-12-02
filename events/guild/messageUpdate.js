module.exports = (client, oldMessage, newMessage) => {
	const Colour = require('../../data/colours.json');

	if (oldMessage.partial) {
		return;
	}

	if (oldMessage.channel.type === 'dm') return;
	if (newMessage.author.bot || oldMessage.content == newMessage.content) return;
	if (oldMessage.channel.name == '👥management') return;
	if (oldMessage.channel.name == '🔧project-untitled') return;
	if (oldMessage.channel.name == '🔒classified') return;
	if (oldMessage.channel.name == '🔧mwt') return;

	const oldMessageShorten = oldMessage.content.length > 900 ? oldMessage.content.substring(0, 850) + '...' : oldMessage.content;
	const newMessageShorten = newMessage.content.length > 900 ? newMessage.content.substring(0, 850) + '...' : newMessage.content;

	if (oldMessage.attachments.size > 0) {
		if (oldMessage.content.length === 0) {
			const attachmentlogembed = new MessageEmbed()
				.setTitle(':warning: Warning!')
				.setColor(Colour.yellow)
				.setDescription(`**Attachment message sent by <@!${oldMessage.author.id}> edited in ${oldMessage.channel}** [Jump to message](${newMessage.url})`)
				.addField('Before', 'None')
				.addField('After', newMessageShorten)
				.setFooter(`User ID: ${oldMessage.author.id} | Message ID: ${newMessage.id}`)
				.setTimestamp();

			modLogs.send(attachmentlogembed);
		}
		else {
			const messageEdit = new MessageEmbed()
				.setTitle(':warning: Warning!')
				.setColor(Colour.yellow)
				.setDescription(`**Attachment message sent by <@!${oldMessage.author.id}> edited in ${oldMessage.channel}** [Jump to message](${newMessage.url})`)
				.addField('Before', oldMessageShorten)
				.addField('After', newMessageShorten)
				.setFooter(`User ID: ${oldMessage.author.id} | Message ID: ${newMessage.id}`)
				.setTimestamp();

			// eslint-disable-next-line no-undef
			modLogs.send(messageEdit);
		}
	}
	else {
		const messageEdit = new MessageEmbed()
			.setTitle(':warning: Warning!')
			.setColor(Colour.yellow)
			.setDescription(`**Message sent by <@!${oldMessage.author.id}> edited in ${oldMessage.channel}** [Jump to message](${newMessage.url})`)
			.addField('Before', oldMessageShorten)
			.addField('After', newMessageShorten)
			.setFooter(`User ID: ${oldMessage.author.id} | Message ID: ${newMessage.id}`)
			.setTimestamp();

		// eslint-disable-next-line no-undef
		modLogs.send(messageEdit);
	}
};
