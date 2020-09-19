const moment = require('moment');

const region = {
	'brazil': 'Brazil',
	'europe': 'Europe',
	'hongkong': 'Hong Kong',
	'india': 'India',
	'japan': 'Japan',
	'russia': 'Russia',
	'singapore': 'Singapore',
	'southafrica': 'South Africa',
	'sydney': 'Sydney',
	'us-central': 'U.S. Central',
	'us-south': 'U.S. South',
	'us-east': 'U.S. East',
	'us-west': 'U.S. West'
};
module.exports = {
	config: {
		name: 'serverinfo',
		description: 'Shows the server statistics.',
		usage: '.serverinfo',
		accessableby: 'Followers+',
		aliases: ['server', 'guild', 'guildinfo'],
		channel: 'bot-commands'
	},
	run: async ({ client: bot, message }) => {

		const icon = message.guild.iconURL({ size: 2048 });
		const channels = message.guild.channels;

		const serverinfo = new MessageEmbed()
			.setAuthor(message.guild.name, icon)
			.addField('Owner:', message.guild.owner.user.tag, true)
			.addField('Region', region[message.guild.region], true)
			.addField('Members', message.guild.memberCount, true)
			.addField('Online', message.guild.members.cache.filter(mem => mem.presence.status != 'offline').size, true)
			.addField('Bots', message.guild.members.cache.filter(mem => mem.user.bot === true).size, true)
			.addField(`Channels [${channels.cache.size}]`, `Text - ${channels.cache.filter(r => r.type === 'text').size}\nVoice - ${channels.cache.filter(r => r.type === 'voice').size}\n Categories - ${channels.cache.filter(r => r.type === 'category').size}`, true)
			.addField(`Role List [${message.guild.roles.cache.size - 1}]`, message.guild.roles.cache.map(r => r).join(' ').replace('@everyone', ' '))
			.setFooter(`Server ID: ${message.guild.id} | Server Created: ${moment.utc(message.guild.createdAt).format('MMMM Do YYYY')}`)
			.setColor(colours.blurple);

		message.channel.send(serverinfo);
	},
};
