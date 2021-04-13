const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    posts: [{
        type: mongoose.Schema.ObjectId,
        ref: "Post"
    }],
    gardens: [{
        type: mongoose.Schema.ObjectId,
        ref: "Garden"
    }],
    tasks: [{
        type: mongoose.Schema.ObjectId,
        ref: "Task"
    }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;