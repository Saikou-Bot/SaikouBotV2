/* eslint-disable no-undef */
const moment = require('moment');

const { getUserMod } = require('../utils/getUserMod');
const warnData = require('../../models/warnData');
const errors = embeds;

module.exports = {
	config: {
		name: 'ban',
		description: 'Reserved for the staff team to ban a user.',
		usage: '.ban <user> <reason>',
		accessableby: 'Staff',
		aliases: ['permban', 'permremove'],
	},
	run: async ({ client: bot, message, args }) => {

		const member = getUserMod(message, args[0]);
		const reason = args.slice(1).join(' ');
		let warns = '';

		if (!message.member.hasPermission('BAN_MEMBERS')) {
			return errors.noPerms(message, '<Ban Members>' || message, '.ban');
		}

		if (!member) {
			return errors.noUser(message, 'ban');
		}

		if (member.id === message.author.id) {
			return errors.yourself(message, 'ban');
		}

		if (member.user.bot) {
			return errors.bots(message, 'mute');
		}

		if (member.hasPermission('BAN_MEMBERS')) {
			return errors.equalPerms(message, 'Ban Members');
		}

		if (!member.kickable) {
			return errors.unable(message, 'ban');
		}

		if (!reason) {
			return errors.noReason(message, 'ban');
		}


		warnData.findOne({
			userID: member.id,
			guild: message.guild.id,
		}, (err, warnings) => {
			if (err) console.log(err);


			warnData.deleteOne({ userID: member.id }).catch(err => console.log(err));
			member.ban(reason);

			const embed3 = new MessageEmbed()
				.setDescription(`✅ **${member.displayName} has been banned.**`)
				.setColor(colours.green);

			message.channel.send(embed3);

			member.send(new MessageEmbed()
				.setTitle('Banned')
				.setDescription('You have received a **ban** in Saikou due to your behaviour within our server.')
				.addField('Banned By', `${message.author.tag}`)
				.addField('Reason', `${args.slice(1).join(' ')}`)
				.setColor(colours.red)
				.setFooter('THIS IS AN AUTOMATED MESSAGE')
				.setTimestamp()).catch(() => { return; });

			if (!warnings) {
				warns = 1;
			}
			else {
				warns = warnings.warns.length + 1;
			}

			modLogs.send(new MessageEmbed()
				.setAuthor(`Case ${warns} | Ban | ${member.displayName}`, member.user.displayAvatarURL())
				.addField('User:', `<@${member.id}>`, true)
				.addField('Moderator', `<@${message.author.id}>`, true)
				.addField('Reason', `${args.slice(1).join(' ')}`, true)
				.setColor(colours.red)
				.setFooter(`Banned User ID: ${member.id}`)
				.setTimestamp());


			moderation.send(`${moment().format('D/M/YYYY')} **Saikou Discord**\nModerator: <@${message.author.id}>\nUser's Name(s): <@${member.id}>\nPunishment: Server Ban.\nReason: ${reason}\nProof:`);


		});
	},
};
