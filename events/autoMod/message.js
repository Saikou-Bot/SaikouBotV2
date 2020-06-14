const warnUtil = require('../../commands/utils/warn');

const AntiSpam = require('discord-anti-spam');
const antiSpam = new AntiSpam({
	warnThreshold: 3,
	kickThreshold: 7,
	banThreshold: 7,
	maxInterval: 2000,
	warnMessage: '{@user}, You have been warned for spamming',
	kickMessage: '**{user_tag}** has been kicked for spamming.',
	banMessage: '**{user_tag}** has been banned for spamming.',
	maxDuplicatesWarning: 7,
	maxDuplicatesKick: 10,
	maxDuplicatesBan: 12,
	exemptPermissions: [],
	ignoreBots: true,
	ignoredUsers: [],
});

module.exports = (client, message) => {
	antiSpam.message(message);
};

antiSpam.on('warnAdd', member => {
	warnUtil.addWarn({
		user: member.id,
		guild: member.guild.id,
		warn: {
			moderator: member.client.user.id,
			reason: 'Auto mod',
		},
	});
});
