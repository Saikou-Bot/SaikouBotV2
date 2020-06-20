const mongoose = require('mongoose');

const dailyCooldown = mongoose.Schema({
	id: String,
	timestamp: { type: Date, default: new Date(0) }
});

module.exports = mongoose.model('dailyCooldown', dailyCooldown);
