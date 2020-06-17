/* eslint-disable no-undef */
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const ms = require('ms');

const { getUserMod } = require('../utils/getUserMod');
const warnData = require('../../models/warnData');
const errors = require('.././utils/embeds');
const colours = require('../../jsonFiles/colours.json');

module.exports = {
	config: {
		name: 'mute',
		description: 'Reserved for the staff team to mute a user.',
		usage: '.mute <user> <time> <reason>',
		accessableby: 'Staff',
		aliases: ['nospeak'],
	},
	run: async (bot, message, args) => {

		const member = getUserMod(message, args[0]);
		const reason = args.slice(2).join(' ');
		let mutedRole = message.guild.roles.cache.find(role => role.name === 'Muted');
		const time = args[1];

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

		if (member.hasPermission('MANAGE_MESSAGES')) {
			return errors.equalPerms(message, 'Manage Messages');
		}

		if (!time) {
			return message.channel.send(new MessageEmbed()
				.setColor(colours.red)
				.setTitle('⏱️ Supply a time!')
				.setDescription('Please supply a correct time for the command **mute**.')
				.setFooter('h - Hours ● Days - d'));
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

		warnData.findOne({
			userID: member.id,
			guild: message.guild.id,
		}, (err, warnings) => {
			if (err) console.log(err);

			if (!warnings) {
				const newWarnData = new warnData({
					userID: member.id,
					guild: message.guild.id,
					warns: [{ Moderator: message.author.id, Time: moment().format('MMMM Do YYYY'), Reason: `[**${ms(ms(time))} mute**] ${reason}` }],
				});
				newWarnData.save();

			}

			else {
				warnData.updateOne(
					{ userID: member.id },
					{
						$push: {
							warns: {
								'Moderator': message.author.id,
								'Time': moment().format('MMMM Do YYYY'),
								'Reason': `[**${ms(ms(time))} mute**] ${reason}`,
							},
						},
					},
				).catch(err => console.log(err));

				member.send(new MessageEmbed()
					.setTitle('Muted')
					.setDescription('You have received a **mute** in Saikou due to your behaviour within our server. Improve how you act otherwise you will be kicked.')
					.addField('Muted By', `${message.author.tag}`)
					.addField('Muted For', `${ms(ms(time))}`)
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


				moderation.send(`${moment().format('D/M/YYYY')} **Saikou Discord**\nModerator: <@${message.author.id}>\nUser's Name(s): <@${member.id}>\nPunishment: ${ms(ms(time))} server mute.\nReason: ${reason}\nProof:`);


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
		});

	},
};
