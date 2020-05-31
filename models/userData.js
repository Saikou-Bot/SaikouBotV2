const mongoose = require('mongoose');

const userDataSchema = mongoose.Schema({
    username: String,
    userID: String,
    lb: String,
    coins: Number,
    medals: Number,
    items: [
        { itemName: String, itemID: String, itemQuantity: Number, itemSell: Number, itemEmoji: String, itemType: String, multipurchase: Boolean },
    ],
});

module.exports = mongoose.model('userData', userDataSchema);