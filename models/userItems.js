if (!mongoose) var mongoose = require('mongoose');

const useritemsSchema = mongoose.Schema({
	username: String,
	userID: String,
	itemName: String,
	itemQuantity: Number,
	itemSell: Number,
	itemEmoji: String,
	itemType: String,
	multipurchase: Boolean,


});

module.exports = mongoose.model('userItems', useritemsSchema);
