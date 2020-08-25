module.exports = {
	config: {
		name: 'suggest',
		description: 'Lets you suggest in suggestions.',
		usage: '.suggest <suggestion>',
		accessableby: 'Followers+',
		aliases: ['suggestion'],
		channel: 'suggestions'
	},
	async run({
		client: bot,
		message,
		args,
		databases
	}) {
		const { suggestion: Suggestion } = databases;
		const suggestion = args.join(' ');
		const shortenMessage = suggestion.length > 1900 ? suggestion.substring(0, 1800) + '...' : suggestion;

		const notEnoughWords = new MessageEmbed()
			.setTitle('📜 Not enough words!')
			.setDescription('Your suggestion must contain at least **15** or more letters before being able to have it posted.')
			.setColor(colours.red)
			.setFooter('Incorrect word amount')
			.setTimestamp();

		if (suggestion.length < 15) return message.channel.send(notEnoughWords).then(msg => msg.delete({ timeout: 15000 }));


		const suggestEmbed = new MessageEmbed()
			.setTitle(`Suggestion ${await Suggestion.nextCount()}`)
			.setDescription(shortenMessage)
			.setColor(colours.blurple)
			.setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
			.setTimestamp();

		const suggestionMessage = await message.channel.send(suggestEmbed);

		suggestionMessage.react('⬆️')
			.then(() => {
				suggestionMessage.react('⬇️');
			});

		const doc = await Suggestion.create({ channelID: message.channel.id, messageID: suggestionMessage.id, body: suggestion });
	},
};