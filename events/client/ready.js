module.exports = (bot) => {
	const guild = bot.guilds.cache.get(process.env.GUILD);
	guild.members.fetch();

	global.modLogs = guild.channels.cache.find(c => c.name.includes('mod-logs'));
	global.moderation = guild.channels.cache.find(c => c.name.includes('moderation'));
	global.joinleaves = guild.channels.cache.find(c => c.name.includes('join-and-leaves'));

	console.log(`\n${bot.user.username} has loaded successfully and is online. \nServers: ${bot.guilds.cache.size}   Users: ${guild.memberCount}   Channels: ${bot.channels.cache.size}`);

	const statuses = [`${guild.memberCount} users | .help`, `${bot.channels.cache.size} channels`, 'Saikou Staff | .help'];


	function updateStatus() {
		const status = statuses[Math.floor(Math.random() * statuses.length)];
		bot.user.setActivity(status, {
			type: 'STREAMING',
			url: 'https://twitch.tv/doingthisforthestatuslol'
		});
	}
	updateStatus();
	setInterval(updateStatus, 15000);
};