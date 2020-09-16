module.exports = {
	config: {
		name: 'economy',
		description: 'Gives some information about the upcoming economy release.',
		usage: '.economy',
		accessableby: 'Followers+',
		aliases: ['eco'],
		channel: 'bot-commands',
		cooldown: true,
		autoCooldown: true,
	},
	run: async ({ client: bot, message, args }) => {

		message.channel.send(new MessageEmbed()
			.setTitle('Upcoming Economy')
			.setThumbnail(bot.user.displayAvatarURL())
			.setDescription('Hey! Our developers are currently working on getting out the economy release in phases, make sure to keep an eye on our patch notes, planned to include...\n\n• Entire revamp of previous commands\n• Full purchase and inventory system\n• And more... What you thought we were going to spoil it all?')
			.setColor(colours.green)
			.setFooter('Coming soon!')
			.setTimestamp());
	}
};