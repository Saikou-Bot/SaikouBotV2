global.mongoose = require('mongoose');
const dotenv = require('dotenv');
const Warn = require('../models/warnData');

const guildID = '397791695514894341';

dotenv.config({
	path: __dirname + '/../.env'
});

const logs = require('./warnlogs.json');

mongoose.connect(process.env.MONGOPASSWORD, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
})
	.then(async () => {
		for (var i = 0; i < logs.length; i++) {
			const log = logs[i];
			if (log.type != 'Warn') continue;

			const warn = {
				Moderator: log.mod.id,
				Time: new Date(log.createdAt),
				Reason: log.reason
			};

			let userWarn = await Warn.findOne({ userID: log.user.id });
			if (!userWarn) {
				userWarn = new Warn({
					userID: log.user.id,
					guild: guildID,
					warns: []
				});
			}

			userWarn.warns.push(warn);
			await userWarn.save();
			console.log('Added warn for', log.user.username);
		}
		mongoose.connection.close();
	});