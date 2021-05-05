const Event = require("../models/Event");
const Post = require("../models/Post");
const User = require("../models/User");

const router = require("express").Router();

router.route("/").get(async (req, res) => {
    console.log("GET user");

    if (req.session.user.type != "admin") {
        res.json({ message: "ERROR - this is an admin function" });
        return;
    }

    res.json(await User.find()
        .populate("posts")
        .populate("gardens")
        .populate("tasks")
        .populate("events"));
});

/**
 * req.body.user: User._id  // user performing action
 * req.body.selectedUser: User._id  // user to change admin rights of
 */
router.route("/toggle-admin-rights").post(async (req, res) => {
    console.log("POST user/toggle-admin-rights");

    if (req.session.user.type != "admin") {
        res.json({ message: "ERROR - this is an admin function" });
        return;
    }

    let user = User.find({ _id: selectedUser });

    if (user == null || user == undefined) {
        res.json({ message: "ERROR - this user does not exist" });
        return;
    }

    user.type = user.type == "admin" ? "user" : "admin";
    user.save();

    res.json(user);
});

router.route("/admin-delete").post(async (req, res) => {
    console.log("POST user/toggle-admin-rights");

    if (req.session.user.type != "admin") {
        res.json({ message: "ERROR - this is an admin function" });
        return;
    }

    let user = User.find({ _id: selectedUser });

    if (user == null || user == undefined) {
        res.json({ message: "ERROR - this user does not exist" });
        return;
    }

    Event.deleteMany({ user: user._id });
    Post.deleteMany({ user: user._id });

    user.delete();

    res.json({ message: "user deleted successfully" });
});

module.exports = router;