const User = require("../models/User");

const router = require("express").Router();

router.route("/").get(async (req, res) => {
    console.log("GET user")
    res.json(await User.find()
        .populate("posts")
        .populate("gardens")
        .populate("tasks")
        .populate("events"));
});

module.exports = router;