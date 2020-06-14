/* eslint-disable no-undef */
const { MessageEmbed } = require('discord.js');

const { getUserMod } = require('../utils/getUserMod');
const warnUtil = require('../utils/warn');
const errors = require('.././utils/errors');
const colours = require('../../jsonFiles/colours.json');

module.exports = {
    config: {
        name: 'warn',
        description: 'Reserved for the staff team to warn a user.',
        usage: '.warn <user> <reason>',
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

        const reason = args.slice(1).join(' ');

        if (!reason) {
            return errors.noReason(message, 'warn');
        }

        const warnings = await warnUtil.addWarn({
            user: member.id,
            guild: message.guild.id,
            warn: {
                moderator: message.author.id,
                reason: reason,
            },
        });

        const embed = new MessageEmbed()
            .setDescription(`✅ **${member.displayName} has been warned**`)
            .addField('Warnings:', warnings.warns.length, true)
            .setColor(colours.green);

        message.channel.send(embed);

        member.send(new MessageEmbed()
            .setTitle('Warning')
            .setDescription('You have received a **Warning** in Saikou due to your behaviour within our server. Improve how you act otherwise you will be punished again.')
            .addField('Warned By', `${message.author.tag}`)
            .addField('Reason', `${reason}`)
            .setColor(colours.red)
            .setFooter('THIS IS AN AUTOMATED MESSAGE')
            .setTimestamp()).catch(() => {
                return;
            });

        modLogs.send(new MessageEmbed()
            .setAuthor(`Case ${warnings.warns.length + 1} | Warning | ${member.displayName}`, member.user.displayAvatarURL())
            .addField('User:', `<@${member.id}>`, true)
            .addField('Moderator', `<@${message.author.id}>`, true)
            .addField('Reason', `${reason}`, true)
            .setColor(colours.red)
            .setFooter(`Warned User ID: ${member.id}`)
            .setTimestamp());

    },
};
