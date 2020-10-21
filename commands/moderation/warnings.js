const errors = embeds;
const Warn = require('../../models/warn').model;
const moment = require('moment');

module.exports = {
	config: {
		name: 'warnings',
		description: 'Reserved for the staff team to check a users warnings.',
		usage: '.warnings <user>',
		accessableby: 'Staff',
		aliases: ['viewwarns', 'checkwarns'],
	},
	run: async ({ client: bot, message, args, utils: { getUserMod } }) => {

		const member = getUserMod(message, args[0]);

		if (!member) {
			return errors.noUser(message, 'view warns');
		}

		Warn.find({
			memberID: member.id,
			guildID: message.guild.id,
		}, (err, warnings) => {
			if (err) console.log(err);

			if (!warnings) {
				const NoWarns = new MessageEmbed()
					.setDescription('ℹ️ This user has no warnings.')
					.setColor(colours.blurple);

				return message.channel.send(NoWarns);
			}

			const warnEmbed = new MessageEmbed()
				.setAuthor(`${member.displayName} has ${warnings.length} warnings in ${message.guild.name}`, member.user.displayAvatarURL())
				.setColor(colours.blurple);

			warnings.forEach((a, i) => {
				const moderator = message.guild.members.cache.get(a.moderatorID);
				warnEmbed.addField(`Warning: ${i + 1} | Moderator: ${moderator ? moderator.user.tag : 'N/A'}`, `${a.reason} - ${moment(a.date).format('MMMM Do YYYY')}\n\`${a._id}\``);
			});

			message.channel.send(warnEmbed);
		});
	},
};
