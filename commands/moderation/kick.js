/* eslint-disable no-undef */
const moment = require('moment');
const errors = embeds;

module.exports = {
	config: {
		name: 'kick',
		description: 'Reserved for the staff team to kick a user.',
		usage: '.kick <user> <reason>',
		accessableby: 'Staff',
		aliases: ['remove'],
	},
	run: async ({ client: bot, message, args, utils: { getUserMod, warn: warnUtil } }) => {

		const member = getUserMod(message, args[0]);
		const reason = args.slice(1).join(' ');

		if (!message.member.hasPermission('KICK_MEMBERS')) {
			return errors.noPerms(message, '<Kick Members>' || message, '.kick');
		}

		if (!member) {
			return errors.noUser(message, 'kick');
		}

		if (member.id === message.author.id) {
			return errors.yourself(message, 'kick');
		}

		if (member.user.bot) {
			return errors.bots(message, 'kick');
		}

		if (member.hasPermission('KICK_MEMBERS')) {
			return errors.equalPerms(message, 'Kick Members');
		}

		if (!member.kickable) {
			return errors.unable(message, 'kick');
		}

		if (!reason) {
			return errors.noReason(message, 'kick');
		}


		const warnings = await warnUtil.addWarn({
			user: member.id,
			guild: message.guild.id,
			warn: {
				moderator: message.author.id,
				reason: `[**Server kick**] ${reason}`,
			},
		});

		member.kick();


		const embed2 = new MessageEmbed()
			.setDescription(`✅ **${member.displayName} has been kicked.**`)
			.setColor(colours.green);

		message.channel.send(embed2);


		member.send(new MessageEmbed()
			.setTitle('Kicked')
			.setDescription('You have received a **kick** in Saikou due to your behaviour within our server. Improve how you act otherwise you will be banned.')
			.addField('Kicked By', `${message.author.tag}`)
			.addField('Reason', `${args.slice(1).join(' ')}`)
			.setColor(colours.red)
			.setFooter('THIS IS AN AUTOMATED MESSAGE')
			.setTimestamp()).catch(() => { return; });


		modLogs.send(new MessageEmbed()
			.setAuthor(`Case ${warnings.warns.length + 1} | Kick | ${member.displayName}`, member.user.displayAvatarURL())
			.addField('User:', `<@${member.id}>`, true)
			.addField('Moderator', `<@${message.author.id}>`, true)
			.addField('Reason', `${args.slice(1).join(' ')}`, true)
			.setColor(colours.red)
			.setFooter(`Kicked User ID: ${member.id}`)
			.setTimestamp());


		moderation.send(`${moment().format('D/M/YYYY')} **Saikou Discord**\nModerator: <@${message.author.id}>\nUser's Name(s): <@${member.id}>\nPunishment: Server Kick.\nReason: ${reason}\nProof:`);


	},
};
