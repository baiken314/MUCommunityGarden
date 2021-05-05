const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    tags: [String],
    type: String,  // "post", "annoucement"

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },

    // this post references a garden
    garden: {
        type: mongoose.Schema.ObjectId,
        ref: "Garden"
    },

    likedBy: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],

    date: Date,
    parent: {
        type: mongoose.Schema.ObjectId,
        ref: "Post"
    }
});

postSchema.virtual("comments", {
    ref: "Post",
    localField: "_id",
    foreignField: "parent"
});

postSchema.virtual("likes", () => {
    return this.likedBy.length;
});

postSchema.set("toObject", { virtuals: true });
postSchema.set("toJSON", { virtuals: true });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;