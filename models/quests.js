const mongoose = require('mongoose');

const questsSchema = mongoose.Schema({
	QuestTitle: String,
	Difficulty: String,
	Description: String,
	Reward: Number,
});

module.exports = mongoose.model('Quests', questsSchema);