const mongoose = require("mongoose");

const gardenSchema = new mongoose.Schema({
    plot: Number,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "Task"
    },
    tasks: [{
        type: mongoose.Schema.ObjectId,
        ref: "Task"
    }]
});

const Garden = mongoose.model("Garden", gardenSchema);

module.exports = Garden;