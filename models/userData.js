const mongoose = require('mongoose');

const userDataSchema = mongoose.Schema({
	username: String,
	userID: String,
	lb: String,
	coins: Number,
	medals: Number,
});

module.exports = mongoose.model('userData', userDataSchema);