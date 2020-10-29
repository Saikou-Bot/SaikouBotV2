const AntiSpam = require('discord-anti-spam');
const antiSpam = new AntiSpam({
	warnThreshold: 3,
	kickThreshold: 5,
	banThreshold: 5,
	maxInterval: 2000,
	warnMessage: '{@user}, You have been warned for spamming',
	kickMessage: '**{user_tag}** has been kicked for spamming.',
	banMessage: '**{user_tag}** has been banned for spamming.',
	maxDuplicatesWarning: 4,
	maxDuplicatesKick: 5,
	maxDuplicatesBan: 5,
	maxDuplicatesInterval: 4000,
	exemptPermissions: [],
	ignoreBots: true,
	ignoredUsers: [],
});

module.exports = {
	name: 'antiSpam',
	construct(client) {
		antiSpam.on('warnAdd', member => {
			const warn = new client.databases.warn({
				memebrID: member.id,
				guildID: member.guild.id,
				moderatorID: member.client.user.id,
				reason: 'Auto mod',
			});
			warn.save();
		});
		return antiSpam;
	}
};
