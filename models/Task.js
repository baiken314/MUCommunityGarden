const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: String,
    date: Date,
    completedDate: Date,
    public: Boolean,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    completedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    garden: {
        type: mongoose.Schema.ObjectId,
        ref: "Garden"
    }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;