const mongoose = require('mongoose');
global.mongoose = mongoose;
const dotenv = require('dotenv');
const WarnData = require('./warnData');
const Warn = require('../models/warn');

dotenv.config({
	path: __dirname + '/../.env'
});

mongoose.connect(process.env.MONGOPASSWORD, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
})
	.then(async () => {
		const allWarnData = WarnData.find({});

		for (var i = 0; i < allWarnData.length; i++) {
			const warnData = allWarnData[i];

			for (var j = 0; j < warnData.warns.length; j++) {
				const warnItem = warnData.warns[j];

				console.log(`${warnData.userID}: ${warnItem.Reason}`);

				const warn = new Warn({
					memberID: warnData.userID,
					guildID: warnData.guild,
					moderatorID: warnItem.Moderator,
					date: warnItem.Time,
					reason: warn.Reason
				});

				await warn.save();
			}
		}
	});