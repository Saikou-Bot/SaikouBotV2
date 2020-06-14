const warnData = require('../../models/warnData');

function addWarn(options) {
    return new Promise((res, rej) => {
        console.log(options);
        warnData.findOne({
            userID: options.user,
            guild: options.guild
        }, (err, warns) => {
            console.log(warns);
            if (err) return console.error(err);
            const warn = {
                Moderator: options.warn.moderator,
                Time: new Date(),
                Reason: options.warn.reason
            }
            if (!warns) {
                warns = new warnData({
                    userID: options.user,
                    guild: options.guild,
                    warns: [warn]
                });
                res(warns.save());
            } else {
                warns.warns.push(warn);
                res(warns.save());
            }
        });
    });
}

module.exports = {
    addWarn
}