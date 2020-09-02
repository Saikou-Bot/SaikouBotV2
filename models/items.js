if (!mongoose) var mongoose = require('mongoose');

const itemsSchema = mongoose.Schema({
	name: String,
	inshop: Boolean,
});

module.exports = mongoose.model('items', itemsSchema);