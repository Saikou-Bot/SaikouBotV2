if (!mongoose) var mongoose = require('mongoose');
const { autoIncrement } = require('mongoose-plugin-autoinc');

const SuggestionSchema = new mongoose.Schema({
	messageID: { type: String, unique: true, required: true },
	body: { type: String, required: true }
});

SuggestionSchema.plugin(autoIncrement, { model: 'suggestion', field: 'id', startAt: 1 });

module.exports = mongoose.model('suggestion', SuggestionSchema
	);
