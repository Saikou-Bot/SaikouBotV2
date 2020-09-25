const errors = embeds;
const warnData = require('../../models/warnData');
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
		let i = 0;

		if (!member) {
			return errors.noUser(message, 'view warns');
		}

		warnData.findOne({
			userID: member.id,
			guild: message.guild.id,
		}, (err, warnings) => {
			if (err) console.log(err);

			if (!warnings) {
				const NoWarns = new MessageEmbed()
					.setDescription('ℹ️ This user has no warnings.')
					.setColor(colours.blurple);

				return message.channel.send(NoWarns);
			}

			const warnEmbed = new MessageEmbed()
				.setAuthor(`${member.displayName} has ${warnings.warns.length} warnings in ${message.guild.name}`, member.user.displayAvatarURL())
				.setColor(colours.blurple);

			warnings.warns.forEach(a => {
				i++;
				warnEmbed.addField(`Warning: ${i} | Moderator: ${message.guild.members.cache.get(a.Moderator).user.tag}`, `${a.Reason} - ${moment(a.Time).format('MMMM Do YYYY')}\n\`${a.id}\``);
			});

			message.channel.send(warnEmbed);
		});
	},
};
