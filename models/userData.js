const mongoose = require("mongoose")

const userDataSchema = mongoose.Schema({
    username: String,
    userID: String,
    coins: Number,
    items: [
        { itemName: String, itemID: String, itemQuantity: Number, itemSell: Number }
    ]
})

module.exports = mongoose.model("userData", userDataSchema)