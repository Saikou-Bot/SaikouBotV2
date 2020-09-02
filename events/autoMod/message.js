const inviteLink = /discord\.gg|discordapp.com\/invite|discord.com\/invite/m;

module.exports = async (client, message) => {
	if (message.partial) {
		try {
			await message.fetch();
		}
		catch(err) {
			return;
		}
	}
	if (message.author.bot) return;
	const { antiSpam, warn: warnUtil, swearFilter } = client.utils;
	antiSpam.message(message);
	if (inviteLink.test(message.content)) {
		message.delete();
		message.reply('You have been warned for sending invite');
		warnUtil.addWarn({
			user: message.author.id,
			guild: message.guild.id,
			warn: {
				moderator: message.client.user.id,
				reason: 'Invite link'
			}
		});
	}
	else {swearFilter(message);}
};
