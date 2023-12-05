const { Schema, model } = require("mongoose")

const Table = new Schema({
    name: String,
    creationDate: Date,
    pieces: [{
        _id: String,
        type: String,
        color: String,
        case: String
    }],
    orders: [{
        color: String,
        order: Array
    }],
    logs: [{
        _id: String,
        color: String,
        content: String
    }]
})

module.exports = model("Table", Table)