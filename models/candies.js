const mongoose = require('mongoose');

const CandyData = new mongoose.Schema({
	userID: { type: String, required: true },
	amount: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('candies', CandyData);