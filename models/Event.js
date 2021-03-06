const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: String,
    type: String,  // "volunteering", "event"
    content: String,
    date: Date,
    start: Date,
    end: Date,
    hours: Number,  // for volunteering
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    approvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;