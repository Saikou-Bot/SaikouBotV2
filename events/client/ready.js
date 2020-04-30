module.exports = (bot) => {
  console.log(`\n${bot.user.username} has loaded successfully and is online. \nServers: ${bot.guilds.cache.size}   Users: ${bot.users.cache.size}   Channels: ${bot.channels.cache.size}`);

  const statuses = [`${bot.users.cache.size} users | ?help`, `${bot.users.cache.size} users`, `Saikou Staff | ?help`];

  setInterval(() => {
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    bot.user.setActivity(status, { type: 'LISTENING' });
  }, 15000);
};
