module.exports = async (client, message) => {
	if (message.author.bot || message.channel.type != 'text' || !message.channel.name.match('suggestions')) return;
	message.delete().catch(() => {});
}