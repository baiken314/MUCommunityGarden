const mongoose = require("mongoose");

const gardenSchema = new mongoose.Schema({
    plot: Number,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "Task"
    }
});

gardenSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "garden"
});

gardenSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "garden"
});

gardenSchema.set("toObject", { virtuals: true });
gardenSchema.set("toJSON", { virtuals: true });

const Garden = mongoose.model("Garden", gardenSchema);

module.exports = Garden;