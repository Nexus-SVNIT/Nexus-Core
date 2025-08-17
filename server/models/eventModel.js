const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    eventName: {
        type: String,
        required: true,
    },
    eventType: {
        type: String,
    },
    concatEventName: {
        type: String,
        required: true
    },
    eventDate: {
        type: String,
        required: true,
    },
    eventDescription: {
        type: String
    },
    eventPoster: {
        type: String
    },
    eventStatus: {
        type: String
    },
    eventImages: {
        type: [String]
    }
});

module.exports = mongoose.model("event", eventSchema);