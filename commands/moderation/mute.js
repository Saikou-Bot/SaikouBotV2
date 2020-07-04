/* eslint-disable no-undef */
const moment = require('moment');
const ms = require('ms');
const warnUtil = require('../utils/warn');

const { getUserMod } = require('../utils/getUserMod');
const warnData = require('../../models/warnData');
const errors = embeds;

module.exports = {
	config: {
		name: 'mute',
		description: 'Reserved for the staff team to mute a user.',
		usage: '.mute <user> <time> <reason>',
		accessableby: 'Staff',
		aliases: ['nospeak'],
	},
	run: async ({ client: bot, message, args }) => {

		const member = getUserMod(message, args[0]);
		const reason = args.slice(2).join(' ');
		let mutedRole = message.guild.roles.cache.find(role => role.name === 'Muted');
		const time = args[1];

		const noTime = new MessageEmbed()
			.setColor(colours.red)
			.setTitle('⏱️ Supply a time!')
			.setDescription('Please supply a correct time for the command **mute**.')
			.setFooter('h - Hours ● Days - d');

		if (!message.member.hasPermission('MANAGE_MESSAGES')) {
			return errors.noPerms(message, '<Manage Messages>' || message, '.mute');
		}

		if (!member) {
			return errors.noUser(message, 'mute');
		}

		if (member.roles.cache.has(mutedRole.id)) {
			return message.channel.send(new MessageEmbed()
				.setTitle('❌ Already Muted')
				.setDescription('The user you are trying to mute is already muted!')
				.setColor(colours.red)
				.setFooter(`${member.displayName} already muted`));
		}

		if (member.id === message.author.id) {
			return errors.yourself(message, 'mute');
		}

		if (member.user.bot) {
			return errors.bots(message, 'mute');
		}

		if (member.hasPermission('MANAGE_MESSAGES')) {
			return errors.equalPerms(message, 'Manage Messages');
		}

		if (!time) {

			return message.channel.send(noTime);
		}

		if (!time.includes('s' || 'm' || 'h' || 'd')) {
			return message.channel.send(noTime);
		}

		if (!reason) {
			return errors.noReason(message, 'mute');
		}


		if (!mutedRole) {
			try {
				mutedRole = await message.guild.roles.create({
					data: {
						name: 'Muted',
						permissions: [],
					},
					reason: 'Muted role wasn\'t found, new one created.',
				});
				message.guild.channels.cache.forEach(async (channel) => {
					await channel.createOverwrite(mutedRole, {
						SEND_MESSAGES: false,
						SPEAK: false,
						ATTACH_FILES: false,
						ADD_REACTIONS: false,
					});
				});
			}
			catch (err) {
				console.log(err);
			}
		}


		const roles = member.roles.cache.array();

		message.channel.send(`<@${member.id}> has been muted for ${ms(ms(time))}`);

		const warnings = await warnUtil.addWarn({
			user: member.id,
			guild: message.guild.id,
			warn: {
				moderator: message.author.id,
				reason: `[**${ms(ms(time))} mute**] ${reason}`,
			},
		});

		member.send(new MessageEmbed()
			.setTitle('Muted')
			.setDescription('You have received a **mute** in Saikou due to your behaviour within our server. Improve how you act otherwise you will be kicked.')
			.addField('Muted By', `${message.author.tag}`)
			.addField('Muted For', `${ms(ms(time), { long: true })}`)
			.addField('Reason', `${reason}`)
			.setColor(colours.red)
			.setFooter('THIS IS AN AUTOMATED MESSAGE')
			.setTimestamp()).catch(() => { return; });


		modLogs.send(new MessageEmbed()
			.setAuthor(`Case ${warnings.warns.length + 1} | ${ms(ms(time))} Mute | ${member.displayName}`, member.user.displayAvatarURL())
			.addField('User:', `<@${member.id}>`, true)
			.addField('Moderator', `<@${message.author.id}>`, true)
			.addField('Reason', `${reason}`, true)
			.setColor(colours.red)
			.setFooter(`Muted User ID: ${member.id}`)
			.setTimestamp());


		moderation.send(`${moment().format('D/M/YYYY')} **Saikou Discord**\nModerator: <@${message.author.id}>\nUser's Name(s): <@${member.id}>\nPunishment: ${ms(ms(time), { long: true })} server mute.\nReason: ${reason}\nProof:`);


		for (let i = 0; i < roles.length; i++) {
			if (roles[i].name.includes('Follower')) {
				const userRole = roles[i];
				member.roles.remove(roles[i]);

				member.roles.add(mutedRole);


				// eslint-disable-next-line space-before-function-paren
				setTimeout(function () {
					member.roles.add(userRole);
					member.roles.remove(mutedRole);
				}, ms(time));

			}
		}
	}
};
