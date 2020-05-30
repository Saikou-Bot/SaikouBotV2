const mongoose = require('mongoose');

const userDataSchema = mongoose.Schema({
    username: String,
    userID: String,
    lb: String,
    coins: Number,
    items: [
        { itemName: String, itemID: String, itemQuantity: Number, itemSell: Number, itemEmoji: String, itemType: String },
    ],
});

module.exports = mongoose.model('userData', userDataSchema);