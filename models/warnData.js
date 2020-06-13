const mongoose = require('mongoose');

const warnDataSchema = mongoose.Schema({
    userID: String,
    warns: [
        { Moderator: String, Time: Date, Reason: String },
    ],
    guild: String,
});

module.exports = mongoose.model('warns', warnDataSchema);
