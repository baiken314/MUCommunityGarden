const Event = require("../models/Event");
const User = require("../models/User");

const router = require("express").Router();

router.route("/").get(async (req, res) => {
    console.log("GET event")
    res.json(await Event.find().populate("user", "name -_id").populate("approvedBy", "name -_id"));
});

/**
 * req.body.user: user._id
 * req.body.type: String  // "event", "volunteering"
 * req.body.title: String  // if not "volunteering"
 * req.body.start: Date
 * req.body.end: Date
 * req.body.hours: Number  // for volunteering
 */
router.route("/create").post(async (req, res) => {
    console.log("POST event/create");

    // check if dates are in order
    if (req.body.end != undefined || req.body.start > req.body.end) {
        res.json({ message: "ERROR - start date must be before end date" });
        return;
    }

    let user = await User.findOne({ _id: req.body.user });
    await new Event({
        title: req.body.type == "volunteering" ? `VOLUNTEER LOG - ${user.name}` : req.body.title,
        type: req.body.type,
        date: new Date(),
        start: new Date(req.body.start) || null,
        end: null,
        user: user._id,
        approvedBy: user.type == "admin" ? user._id : null,
        hours: req.body.hours || 0,
        content: req.body.content || null
    }).save();

    res.json({ message: "volunteer hours logged" });
});

/**
 * DOES NOT WORK WITH HOURS PARAMETER
 * req.body.user: user._id
 * req.body.event: event._id
 * req.body.title: String
 * req.body.start: Date
 * req.body.end: Date
 */
router.route("/update").post(async (req, res) => {
    console.log("POST event/update");

    let user = await User.findOne({ _id: req.body.user });
    let event = await Event.findOne({ _id: req.body.event });

    if (!event.user.equals(user._id) && user.type != "admin") {
        res.json({ message: "ERROR - user does not have permission to perform this function" });
        return;
    }

    await event.updateOne({
        title: req.body.title,
        start: req.body.start,
        end: req.body.end
    });
});

/**
 * req.body.events: [event._id]
 * req.body.approve: Boolean
 */
router.route("/admin-approve").post(async (req, res) => {
    console.log("POST event/admin-approve");

    if (req.session.user.type != "admin") {
        res.json({ message: "ERROR - user must be admin to perform this function" });
        return;
    }

    for (eventId of req.body.events) {
        let event = await Event.findOne({ _id: eventId });
        event.approvedBy = req.session.user._id;
        await event.save();
    }

    res.json({ message: "event succesfully approved" });
});

/**
 * req.body.user: user._id
 * req.body.events: [event._id]
 */
router.route("/delete").post(async (req, res) => {
    console.log("POST event/delete");

    let user = await User.findOne({ _id: req.body.user });
    
    let canDelete = true;
    for (eventId of req.body.events) {
        let event = await Event.findOne({ _id: eventId });
        if (!event.user.equals(user._id)) {
            canDelete = req.session.user.type == "admin";
            break;
        }
    }

    if (canDelete) {
        for (eventId of req.body.events) {
            let event = await Event.findOne({ _id: eventId });
            await event.delete();
            res.json({ message: "event successfully deleted" });
        }
    }
    else {
        res.json({ message: "ERROR - user cannot perform this function" });
        return;
    }
});

module.exports = router;