module.exports = (bot) => {
  console.log(`\n${bot.user.username} has loaded successfully and is online. \nServers: ${bot.guilds.cache.size}   Users: ${bot.users.cache.size}   Channels: ${bot.channels.cache.size}`);

  const guild = bot.guilds.cache.get("397791695514894341");
  guild.members.fetch()

  const statuses = [`${guild.memberCount} users | .help`, `${guild.memberCount} users`, `Saikou Staff | .help`];

  bot.user.setStatus('idle')
  setInterval(() => {
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    bot.user.setActivity(status, { type: 'LISTENING' });
  }, 15000);
};
