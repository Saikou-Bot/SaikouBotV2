if (!mongoose) var mongoose = require('mongoose');
const { autoIncrement } = require('mongoose-plugin-autoinc');

const SuggestionSchema = new mongoose.Schema({
	userID: { type: String, required: true },
	channelID: { type: String, required: true },
	messageID: { type: String, unique: true, required: true },
	body: { type: String, required: true },
	featured: { type: Boolean, required: true, default: false }
});

SuggestionSchema.plugin(autoIncrement, { model: 'suggestion', field: 'id', startAt: 1 });

module.exports = mongoose.model('suggestion', SuggestionSchema
);
