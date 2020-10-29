const ms = require('ms');

module.exports = {
	config: {
		name: 'reminder',
		description: 'Get reminded about a task you need to do!',
		usage: '.reminder <task> <time>',
		accessableby: 'Followers+',
		aliases: ['remindme'],
		channel: 'bot-commands',
		cooldown: true,
		autoCooldown: true,
	},
	run: async ({ client: bot, message, args }) => {

		const time = args[0];
		const remindTask = args.slice(1).join(' ');

		if (!time) {
			return embeds.noTime(message, 'reminder');
		}

		if (!ms(time)) {
			return embeds.noTime(message, 'reminder');
		}

		if (!remindTask) {
			return message.channel.send(new MessageEmbed()
				.setTitle('📥 Input reminder!')
				.setDescription('Please input a reminder for the bot to remind you about.')
				.setColor(colours.red)
				.setFooter('Input reminder.'));
		}

		message.channel.send(new MessageEmbed()
			.setDescription(`**✅ Reminder set! You will be reminded in ${ms(ms(time), { long: true })}.**`)
			.setColor(colours.green));

		setTimeout(function() {
			const embed = new MessageEmbed()
				.setTitle('⏰ Reminder!')
				.setThumbnail(message.author.displayAvatarURL())
				.setDescription(`You set a reminder for ${ms(ms(time), { long: true })}, down below will list the reminder you provided.\n\n**${remindTask}**`)
				.setColor(colours.green)
				.setFooter(`You set a reminder for ${ms(ms(time))}`, message.author.displayAvatarURL())
				.setTimestamp();
			message.author.send(embed).catch(() => {
				return message.channel.send(`<@${message.author.id}>`, embed );
			});
		}, ms(time));
	}
};