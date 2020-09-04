module.exports = async (client, message) => {
	if (message.channel.type != 'text' || message.attachments.size > 0 || message.content.startsWith('https') || !message.channel.name.match('art')) return;
	message.delete().catch(() => {});
};
