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
    phoneNumber: String,
    password: String,
    receiveSMSNotifications: { type: Boolean, default: true },
    receiveEmailNotifications: { type: Boolean, default: true }
});

userSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "user"
});

userSchema.virtual("gardens", {
    ref: "Garden",
    localField: "_id",
    foreignField: "user"
});

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "user"
});

userSchema.virtual("events", {
    ref: "Event",
    localField: "_id",
    foreignField: "user"
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

const User = mongoose.model("User", userSchema);

module.exports = User;