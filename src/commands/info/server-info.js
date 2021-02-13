const { Command } = require('discord-akairo');
const moment = require('moment');
const humanNumbers = require('human-readable-numbers');
const SaikouEmbed = require('../../structure/SaikouEmbed');

class Serverinfo extends Command {
	constructor() {
		super('server-info', {
			aliases: ['server-info', 'server', 'serverinfo'],
		})
	}
	async exec(message) {
        const guild = await message.guild.fetch(message.guild.id);

        return message.util.send(new SaikouEmbed()
            .setAuthor(guild.name, guild.iconURL({ format: 'png', dynamic: true }))
            .setThumbnail(guild.iconURL({ format: 'png', dynamic: true }))
            .addField('Owner', guild.owner.user.tag, true)
            .addField('Region', guild.region, true)
            .addField('Vanity Invite', guild.vanityURLCode || 'None', true)
            .addField('Rules Channel', guild.rulesChannel, true)
            .addField('Verified', guild.verified, true)
            .addField('Large Server', guild.large, true)
            .addField('Text Channels', guild.channels.cache.filter(channel => channel.type === 'text').size, true)
            .addField('Voice Channels', guild.channels.cache.filter(channel => channel.type === 'voice').size, true)
            .addField('Categories', guild.channels.cache.filter(channel => channel.type === 'voice').size, true)
            .addBlankField()
            .addField('Members', guild.memberCount, true)
            .addField('Online', guild.approximatePresenceCount, true)
            .addField('Offline', guild.approximateMemberCount - guild.approximatePresenceCount, true)
            .addField('Bots', guild.members.cache.filter(member => member.user.bot === true).size, true)
            .addField('Max Members', humanNumbers.toHumanString(guild.maximumMembers), true)
            .addField('Max Online', humanNumbers.toHumanString(guild.maximumPresences), true)
            .addBlankField()
            .addField(`Role List [${guild.roles.cache.filter(role => role.managed !== true).size}]`, guild.roles.cache.filter(role => role.managed !== true).sort((role1, role2) => role2.position - role1.position).array().join(', ').replace(', @everyone', ' '))
            .setFooter(`Server ID: ${guild.id} | Server Created • ${moment.utc(guild.createdAt).format('MMM Do YYYY')}`))


    }
}
module.exports = Serverinfo;