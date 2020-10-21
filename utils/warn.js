class WarnManager {
	constructor(Warn, WarnItems) {
		this.Warn = Warn;
		this.WarnItems = WarnItems;
	}
	addWarn(options) {
		return new Promise((res, rej) => {
			this.WarnItems.findOne({
				userID: options.user,
				guild: options.guild,
			}, async (err, warns) => {
				if (err) return rej(err);
				const warn = new this.Warn({
					Moderator: options.warn.moderator,
					Time: new Date(),
					Reason: options.warn.reason,
				});

				await warn.save();

				if (!warns) {
					warns = new this.WarnItems({
						userID: options.user,
						guild: options.guild,
						warns: [warn],
					});
					res(warns.save());
				}
				else {
					warns.warns.push(warn);
					res(warns.save());
				}
			});
		});
	}
}

module.exports = {
	name: 'warn',
	construct(client) {
		return new WarnManager(require('../models/warn').model, require('../models/warnData'));
	}
};
