module.exports = (client, member) => {
  const ordinal = require('ordinal');
  const { MessageEmbed } = require('discord.js');
  const Colour = require('../../jsonFiles/colours.json');
  const moment = require('moment');


  const WelcomeChannel = member.guild.channels.cache.get('635196002596290611');
  const Server = client.guilds.cache.get('397791695514894341');
  const MemberCount = Server.memberCount;

  const WelcomeMessages = [
    `Welcome to Saikou, please make sure to read our <#397797150840324115>. You are the ${ordinal(MemberCount)} user to join!`,
    'has just entered the server! Great to see you!',
    'Welcome to Saikou, please be sure to read our <#397797150840324115> carefully before chatting. Enjoy your stay with us!',
    'Welcome to the Saikou Discord! We hope you have a great time here.',
    'Welcome to Saikou Development! We have been waiting for you.',
    'Welcome to the Saikou Discord, we are happy to have you here!',
    'Welcome to our server, thanks for stopping by!',

  ];

  const result = Math.floor((Math.random() * WelcomeMessages.length));

  const WelcomeEmbed = new MessageEmbed()
    .setTitle('👋 Welcome to the Server!')
    .setDescription(`<@${member.user.id}> ${WelcomeMessages[result]}`)
    .setColor(Colour.green)
    .setFooter('User joined')
    .setTimestamp();


  WelcomeChannel.send(WelcomeEmbed);

  // -- Log join embed
  const logjoinembed = new MessageEmbed()
    .setColor(Colour.blue)
    .setTitle(':information_source: Member Joined')
    .setDescription(`<@${member.user.id}> has joined the server.`)
    .addField('Username', member.user.username, true)
    .addField('Created', moment(member.user.createdAt).format('MMMM Do YYYY'), true)
    .setFooter(`ID: ${member.user.id}`)
    .setTimestamp();

  member.guild.channels.cache.get('409832539360854019').send(logjoinembed);


};