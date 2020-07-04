module.exports = {
	config: {
		name: 'credits',
		description: 'Lists all the people who have made Saikou a reality, thank you!!',
		usage: '.credits',
		accessableby: 'Followers+',
		aliases: ['creds'],
		channel: 'bot-commands',
		cooldown: true,
		autoCooldown: true,
	},
	run: async ({ client: bot, message, args }) => {

		const credits = new MessageEmbed()
			.setTitle('📄 Credits')
			.setDescription('Big thanks to the following people who have helped Saikou bot become a reality, without them the bot wouldn\'t be where it is today.')
			.addField('→ Bot Developers:', '<@229142187382669312> `[Head Developer]`\n<@670588428970098708> `[Developer]`')
			.addField('→ Contributors:', '<@341317140655243266> `[Helper/Tester]`')
			.setColor(colours.blurple);

		message.channel.send(credits);


	},
};
