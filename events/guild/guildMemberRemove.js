module.exports = (client, member) => {
  const {MessageEmbed } = require('discord.js');
  const Colour = require('../../colours.json')

  let TestWelcomeChannel = member.guild.channels.cache.get('704621852638838919');
  //let WelcomeChannel = member.guild.channels.cache.get('635196002596290611');

  // -- Ban user embed
  member.guild.fetchBan(member).then((ban) => {
   // const gif = new Attachment("https://gph.is/29507Ei")

		const userBannedEmbed = new MessageEmbed()
			.setColor("#f94343")
			.setTitle("Member Banned")
      .setDescription(`**${member.user.tag}** has been banned from Saikou by a member of staff!`)
      .setImage('https://gph.is/29507Ei')
			.setFooter(`User banned`)
			.setTimestamp();

		TestWelcomeChannel.send(userBannedEmbed)
	}).catch(() => {

  const RoleMessages = [
    'has abandoned Saikou. Goodbye!', // Follower
    "has abandoned Saikou. We'll miss you!", // Dedicated Follower
    'has abandoned Saikou. We appreciated your support towards us!', // Ultimate Follower
    "has abandoned Saikou. Thank you for giving us all of your time and entertainment, this server wouldn't be what it is without you. ", // Supreme Follower
    'has abandoned Saikou. After such a long time, you deserve a bit of rest. You will always be remembered as the legend you are. ', // Legendary Follower
    'has abandoned Saikou. Thank you for sticking with us this long. We appreciate it ❤. ', // Omega Follower
    'has abandoned Saikou. Wait... you were a staff member here!' // Staff
  ];


  if (member.roles.cache.some(r => r.name === "Follower")){var msg = new String(); msg += `${RoleMessages[0]}`;}
  else if (member.roles.cache.some(r => r.name === "Dedicated Follower")){var msg = new String(); msg += `${RoleMessages[1]}`;}
  else if (member.roles.cache.some(r => r.name === "Ultimate Follower")){var msg = new String(); msg += `${RoleMessages[2]}`;}
  else if (member.roles.cache.some(r => r.name === "Supreme Follower")){var msg = new String(); msg += `${RoleMessages[3]}`;}
  else if (member.roles.cache.some(r => r.name === "Legendary Follower")){var msg = new String(); msg += `${RoleMessages[4]}`;}
  else if (member.roles.cache.some(r => r.name === "Omega Follower")){var msg = new String(); msg += `${RoleMessages[5]}`;}
  else if (member.roles.cache.some(r => r.name === "Staff")){var msg = new String(); msg += `${RoleMessages[6]}`;}
  else {var msg = new String(); msg += `${RoleMessages[0]}`;} 


  // -- User leave embed  
  const RemoveEmbed = new MessageEmbed()
     .setTitle("Member left Saikou!")
     .setDescription(`**${member.user.tag}** ${msg}`)
     .setColor(Colour.red)
     .setFooter(`User left`)
     .setTimestamp();

  TestWelcomeChannel.send(RemoveEmbed);
});
}
