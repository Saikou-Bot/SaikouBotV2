if (!mongoose) var mongoose = require('mongoose');

const warnSchema = new mongoose.Schema({
	guildID: { type: String },
	memberID: { type: String, required: true },
	moderatorID: { type: String, required: true },
	date: { type: Date, required: true, default: Date.now },
	reason: { type: String, required: true }
});

module.exports = {
	schema: warnSchema,
	model: mongoose.model('warnItem', warnSchema)
};