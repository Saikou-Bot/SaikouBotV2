/* eslint-disable no-undef */
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

const { getUserMod } = require('../utils/getUserMod');
const warnData = require('../../models/warnData');
const errors = require('.././utils/errors');
const colours = require('../../jsonFiles/colours.json');

module.exports = {
    config: {
        name: 'kick',
        description: 'Reserved for the staff team to kick a user.',
        usage: '.kick <user> <reason>',
        accessableby: 'Staff',
        aliases: ['remove'],
    },
    run: async (bot, message, args) => {

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

        if (member.hasPermission('KICK_MEMBERS')) {
            return errors.equalPerms(message, 'Kick Members');
        }

        if (!member.kickable) {
            return errors.unable(message, 'kick');
        }

        if (!reason) {
            return errors.noReason(message, 'kick');
        }


        warnData.findOne({
            userID: member.id,
            guild: message.guild.id,
        }, (err, warnings) => {
            if (err) console.log(err);

            if (!warnings) {
                const newWarnData = new warnData({
                    userID: member.id,
                    guild: message.guild.id,
                    warns: [{ Moderator: message.author.id, Time: moment().format('MMMM Do YYYY'), Reason: `**Kicked** - ${reason}` }],
                });
                newWarnData.save();
                member.kick(reason);

                const embed2 = new MessageEmbed()
                    .setDescription(`✅ **${member.displayName} has been kicked.**`)
                    .setColor(colours.green);

                message.channel.send(embed2);


            }

            else {
                warnData.updateOne(
                    { userID: member.id },
                    {
                        $push: {
                            warns: {
                                'Moderator': message.author.id,
                                'Time': moment().format('MMMM Do YYYY'),
                                'Reason': `**Kicked** - ${reason}`,
                            },
                        },
                    },
                ).catch(err => console.log(err));
                member.kick(reason);

                const embed3 = new MessageEmbed()
                    .setDescription(`✅ **${member.displayName} has been kicked.**`)
                    .setColor(colours.green);

                message.channel.send(embed3);

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


            }

        });
    },
};