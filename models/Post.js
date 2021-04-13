const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    tags: [String],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },

    // this post references a garden
    garden: {
        type: mongoose.Schema.ObjectId,
        ref: "Garden"
    },

    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],

    date: Date,
    parent: this,
    comments: [this]  // comments should not have title, tags, garden
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;