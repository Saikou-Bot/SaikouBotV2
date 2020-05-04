const mongoose = require("mongoose")

const coinsDataSchema = mongoose.Schema({
    username: String,
    userID: String,
    coins: Number
})

module.exports = mongoose.model("coinsData", coinsDataSchema)