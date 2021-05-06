const Garden = require("../models/Garden");

const router = require("express").Router();

router.route("/").get(async (req, res) => {
    console.log("GET garden");
    res.json(await Garden.find()
        .populate("user", "name")
        .populate("tasks")
        .populate("posts")
    );
});

/**
 * req.body.user: User._id  // the person making the post
 * req.body.number: Number
 * req.body.gardener: User._id  // optional for assigning
 */
router.route("/create").post(async (req, res) => {
    console.log("POST garden/create");

    if (req.session.user.type != "admin") {
        res.json({ message: "ERROR - this is an admin function" });
        return;
    }

    await Garden.create({
        number: req.body.number,
        user: req.body.gardener || null
    });

    console.log("END POST garden/create");
});

/**
 * req.body.user: User._id  // the person making the post
 * req.body.number: Number
 */
 router.route("/delete").post(async (req, res) => {
    console.log("POST garden/delete");

    if (req.session.user.type != "admin") {
        res.json({ message: "ERROR - this is an admin function" });
        return;
    }

    let garden = await Garden.findOne({ number: req.body.number });

    await garden.delete();

    console.log("END POST garden/create");
});

/**
 * req.body.user: User._id  // the person making the post
 * req.body.number: Number
 * req.body.gardener: User._id  // optional
 */
 router.route("/assign").post(async (req, res) => {
    console.log("POST garden/assign");

    if (req.session.user.type != "admin") {
        res.json({ message: "ERROR - this is an admin function" });
        return;
    }

    let garden = await Garden.findOne({ number: req.body.number });
    garden.user = gardener;
    garden.save();

    console.log("END POST garden/assign");
});

/**
 * req.body.user: User._id  // the person making the post
 * req.body.number: Number
 */
 router.route("/unassign").post(async (req, res) => {
    console.log("POST garden/delete");

    if (req.session.user.type != "admin") {
        res.json({ message: "ERROR - this is an admin function" });
        return;
    }

    let garden = await Garden.findOne({ number: req.body.number });
    garden.user = null;
    garden.save();

    console.log("END POST garden/create");
});

module.exports = router;