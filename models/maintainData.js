const mongoose = require('mongoose');

const MaintainDataSchema = new mongoose.Schema({
	name: String,
	maintained: { type: Boolean, default: false }
});

module.exports = mongoose.model('MaintainData', MaintainDataSchema);
