const Discord = require('discord.js');

module.exports = {
  config: {
    name: 'avatar',
    description: 'Displays a picture of your avatar.',
    usage: '?raid @user',
    accessableby: 'Public',
    aliases: ['picture', 'pp']
  },
  run: async (bot, message) => {
  
    message.channel.send("working");
  }
};
