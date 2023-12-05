const { Schema, model } = require("mongoose")

const Table = new Schema({
    name: String,
    creationDate: Date,
    pieces: [{
        color: String,
        unite: String,
        case: String
    }],
    players: [{
        socketId: String,
        name: String,
        color: String,
        order: Array
    }],
    logs: [{
        color: String,
        content: String
    }]
});

module.exports = model("Table", Table)