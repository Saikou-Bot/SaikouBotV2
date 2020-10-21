if (!mongoose) var mongoose = require('mongoose');

const { schema: Warn } = require('./warn');

const warnDataSchema = mongoose.Schema({
	userID: String,
	warns: [
		Warn
	],
	guild: String,
});

module.exports = mongoose.model('warns', warnDataSchema);