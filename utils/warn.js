class WarnManager {
	constructor(model) {
		this.model = model;
	}
	addWarn(options) {
		return new Promise((res) => {
			this.model.findOne({
				userID: options.user,
				guild: options.guild,
			}, (err, warns) => {
				if (err) return console.error(err);
				const warn = {
					Moderator: options.warn.moderator,
					Time: new Date(),
					Reason: options.warn.reason,
				};
				if (!warns) {
					warns = new this.model({
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
		return new WarnManager(client.databases.warnData);
	}
};
