const dotenv = require('dotenv');
dotenv.config();
const env = process.env;
const prefix = env.PREFIX;


module.exports = async (bot, message) => {
  if (message.author.bot || message.channel.type === "dm") return;

  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let cmd = args.shift().toLowerCase();

  if (!message.content.startsWith(prefix)) return;
  let commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd))
  if (commandfile) commandfile.run(bot, message, args)
}