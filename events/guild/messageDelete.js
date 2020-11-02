module.exports = (client, message) => {
	const Colour = require('../../data/colours.json');

	if (message.channel.type === 'dm') return;
	if (message.channel.name == '👥management') return;
	if (message.channel.name == '🔧project-untitled') return;
	if (message.channel.name == '🔒classified') return;

	if (message.partial) return;

	if (message.author.bot) return;

	const shortenMessage = message.content.length > 1900 ? message.content.substring(0, 1800) + '...' : message.content;
	const shortenAttachment = message.content.length > 900 ? message.content.substring(0, 900) + '...' : message.content;

	if (message.attachments.size > 0) {

		const attachmentlogembed = new MessageEmbed()
			.setTitle(':warning: Warning!')
			.setColor(Colour.yellow)
			.setDescription(`**Attachment sent by <@!${message.author.id}> was deleted in ${message.channel}**`)
			.setFooter(`User ID: ${message.author.id}`)
			.setTimestamp();

		if (message.content) attachmentlogembed.addField('Message Content', shortenAttachment, true);


		modLogs.send(attachmentlogembed);

	}
	else {

		const logembed = new MessageEmbed()
			.setTitle(':warning: Warning!')
			.setColor(Colour.yellow)
			.setDescription(`**Message sent by ${message.member} was deleted in ${message.channel}**\n${shortenMessage}`)
			.setFooter(`User ID: ${message.author.id}`)
			.setTimestamp();


		modLogs.send(logembed);

	}
};

