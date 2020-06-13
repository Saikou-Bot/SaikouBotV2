const warnData = require('../../models/warnData.js');
const moment = require('moment');

const AntiSpam = require('discord-anti-spam');
const antiSpam = new AntiSpam({
    warnThreshold: 3,
    kickThreshold: 7,
    banThreshold: 7,
    maxInterval: 2000,
    warnMessage: '{@user}, You have been warned for spamming',
    kickMessage: '**{user_tag}** has been kicked for spamming.',
    banMessage: '**{user_tag}** has been banned for spamming.',
    maxDuplicatesWarning: 7,
    maxDuplicatesKick: 10,
    maxDuplicatesBan: 12,
    exemptPermissions: [],
    ignoreBots: true,
    verbose: true,
    debug: true,
    ignoredUsers: []
});

module.exports = (client, message) => {
    antiSpam.message(message);
}

antiSpam.on('warnAdd', member => {
    warnData.findOne({
        userID: member.id,
        guild: member.guild.id
    }, (err, warnings) => {
        if (err) return console.error(err);
        if (!warnings) {
            warnings = new warnData({
                userId: member.id,
                guild: member.guild.id,
                warns: [{
                    Moderator: member.client.user.id,
                    Time: moment().format('MMMM Do YYYY'),
                    Reason: 'Anti spam'
                }]
            });
            warnings.save();
        } else {
            warnData.updateOne({
                userID: member.id,
                guild: member.guild.id
            }, {
                $push: {
                    warns: {
                        'Moderator': member.client.user.id,
                        'Time': moment().format('MMMM Do YYYY'),
                        'Reason': 'Anti spam',
                    },
                },
            });
        }
    });
});
