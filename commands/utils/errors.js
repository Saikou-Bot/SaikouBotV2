const { MessageEmbed } = require('discord.js');
const colours = require('../../jsonFiles/colours.json');


module.exports.noCoins = (message, name, cost) => {
    const embed = new MessageEmbed()
        .setTitle('💰 Insufficent funds!')
        .setDescription(`You need at least \`S$${cost}\` to buy **${name}**!`)
        .setColor(colours.red)
        .setFooter('Insufficent Funds!')
        .setTimestamp();
    // sends the embed
    message.channel.send(embed);
},


    module.exports.noUser = (message, name) => {
        const embed = new MessageEmbed()
            .setTitle('🔍 Unable to find User!')
            .setDescription(`Please provide a valid user to **${name}**!`)
            .setColor(colours.red)
            .setFooter('No user!')
            .setTimestamp();
        // sends the embed
        message.channel.send(embed);
    },


    module.exports.noReason = (message, name) => {
        const embed = new MessageEmbed()
            .setTitle('📝 No reason provided')
            .setDescription(`Please provide a reason to **${name}** the user!`)
            .setColor(colours.red)
            .setFooter('No reason detected')
            .setTimestamp();
        // sends the embed
        message.channel.send(embed);
    },


    module.exports.noPerms = (message, perms, name) => {
        const embed = new MessageEmbed()
            .setTitle('🔐 Incorrect Permissions')
            .setDescription(`**Command Name:** ${name}\n**Permissions Needed:** ${perms}`)
            .setColor(colours.red)
            .setFooter('<> - Staff Perms ● Public Perms - [] ');
        // sends the embed
        message.channel.send(embed);
    },


    module.exports.equalPerms = (message, perms) => {
        const embed = new MessageEmbed()
            .setTitle('⚙️ Equal Permissions')
            .setDescription(`The user you are trying to perform this action on has equal permissions to you, consider..\n
            • Changing the user's permissions
            • Changing the user's roles`)
            .setColor(colours.red)
            .setFooter(`Equal Permission(s): ${perms}`);
        // sends the embed
        message.channel.send(embed);
    },


    module.exports.yourself = (message, name) => {
        const embed = new MessageEmbed()
            .setTitle(`🔐 Cannot ${name} yourself`)
            .setDescription(`You cannot ${name} yourself, please input a correct user to provide the punishment to.`)
            .setColor(colours.red)
            .setFooter(`Unable to ${name} user.`);
        // sends the embed
        message.channel.send(embed);
    },


    module.exports.unable = (message, name) => {
        const embed = new MessageEmbed()
            .setTitle(`❌ Unable to ${name} user`)
            .setDescription(`The user you are trying to perform this action on is unable to be ${name} consider..\n
            • Making sure Saikou's role is higher than theirs
            • User doesn't have an admin/moderator role`)
            .setColor(colours.red)
            .setFooter(`Unable to ${name} user.`);
        // sends the embed
        message.channel.send(embed);
    };