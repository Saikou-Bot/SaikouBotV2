if (!mongoose) var mongoose = require('mongoose');

const UserquestsSchema = mongoose.Schema({
	Username: String,
	UserID: String,
	Quest: String,
	Difficulty: String,
	Description: String,
	Reward: Number,
	completed: { type: Boolean, default: false },
});

module.exports = mongoose.model('userQuests', UserquestsSchema);