if (!mongoose) var mongoose = require('mongoose');

const warnSchema = new mongoose.Schema({
	Moderator: { type: String, required: true },
	Time: { type: Date, required: true },
	Reason: { type: String, required: true }
});

module.exports = {
	schema: warnSchema,
	model: mongoose.model('warnItem', warnSchema)
};