const { MessageEmbed } = require('discord.js');
const moment = require('moment');

const { getUserMod } = require('../utils/getUserMod');
const warnData = require('../../models/warnData');
const errors = require('.././utils/errors');
const colours = require('../../jsonFiles/colours.json');

module.exports = {
    config: {
        name: 'warn',
        description: 'Reserved for the staff team to warn a user',
        usage: '.warn/givewarn <user>',
        accessableby: 'Staff',
        aliases: ['givewarn'],
    },
    run: async (bot, message, args) => {

        const member = getUserMod(message, args[0]);

        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            return errors.noPerms(message, '<Manage Messages>' || message, '.warn');
        }

        if (!member) {
            return errors.noUser(message, 'warn');
        }

        if (member.hasPermission('MANAGE_MESSAGES')) {
            return errors.equalPerms(message, 'Manage Messages');
        }

        if (!args.slice(1).join(' ')) {
            return errors.noReason(message, 'warn');
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
                    warns: [{ Moderator: message.author.id, Time: moment().format('MMMM Do YYYY'), Reason: args.slice(1).join(' ') }],
                });
                newWarnData.save();

                const embed = new MessageEmbed()
                    .setDescription(`✅ **${member.displayName} has been warned**`)
                    .addField('Warnings:', '1', true)
                    .setColor(colours.green);

                message.channel.send(embed);

            }
            else {
                warnData.updateOne(
                    { userID: member.id },
                    {
                        $push: {
                            warns: {
                                'Moderator': message.author.id,
                                'Time': moment().format('MMMM Do YYYY'),
                                'Reason': args.slice(1).join(' '),
                            },
                        },
                    },
                ).catch(err => console.log(err));

                const embed = new MessageEmbed()
                    .setDescription(`✅ **${member.displayName} has been warned**`)
                    .addField('Warnings:', warnings.warns.length + 1, true)
                    .setColor(colours.green);

                message.channel.send(embed);
            }

        },
        );


    },
};