const Task = require("../models/Task");
const User = require("../models/User");

const router = require("express").Router();

router.route("/").get(async (req, res) => {
    console.log("GET task");
    res.json(await Task.find());
});

/**
 * req.body.user: User._id
 * req.body.title: String
 * req.body.public: Boolean  // allow other Users to complete a task
 * req.body.garden: Garden  // associate with a garden
 */
router.route("/create").post(async (req, res) => {
    console.log("POST task/create");

    await new Task({
        user: req.body.user,
        title: req.body.title,
        public: req.body.public,
        garden: req.body.garden,
        date: new Date()
    }).save();
});

/**
 * req.body.user: User._id
 * req.body.task: Task._id
 * req.body.title: String
 * req.body.public: Boolean
 * req.body.garden: Garden 
 */
router.route("/update").post(async (req, res) => {
    console.log("POST task/update");

    let user = await User.findOne({ _id: req.body.user });
    let task = await User.findOne({ _id: req.body.task });

    if (!task.user.equals(user._id)) {
        res.json({ message: "ERROR - user cannot perform this function" });
        return;
    }

    await task.updateOne({
        title: req.body.title,
        public: req.body.public,
        garden: req.body.garden
    });
});

/**
 * req.body.user: User._id
 * req.body.tasks: [Task._id]
 */
router.route("/delete").post(async (req, res) => {
    console.log("POST task/delete");

    let user = await User.findOne({ _id: req.body.user });

    let canDelete = true;
    for (taskid of req.body.tasks) {
        let task = await Task.findOne({ _id: taskId });
        if (!task.user.equals(user._id)) {
            canDelete = user.type == "admin";
            break;
        }
    }

    if (canDelete) {
        for (taskId of req.body.tasks) {
            await Task.deleteOne({ _id: taskId });
        }
    }
    else {
        res.json({ message: "ERROR - user cannot perform this function" });
        return;
    }
});

/**
 * req.body.user: User._id
 * req.body.task: Task._id
 */
router.route("/toggle-complete").post(async (req, res) => {
    console.log("POST task/toggle-complete");

    let user = await User.findOne({ _id: req.body.user });
    let task = await Task.findOne({ _id: req.body.task });

    if (!task.user.equals(user._id) && !task.public) {
        res.json({ message: "ERROR - user cannot perform this function" });
        return;
    }

    // toggle complete
    if (task.completedBy != undefined) {
        task.completedDate = new Date();
        task.completedBy = user._id;
    }
    else {
        task.completedDate = undefined;
        task.completedBy = undefined;
    }
});

module.exports = router;