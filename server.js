const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const httpServer = require("http").Server(app);
const io = require("socket.io")(httpServer);

module.exports.io = io;

const MongoStore = require("connect-mongo")(session);

const MONGO_URI = "mongodb+srv://highlandcentralinc:joenamath2021@cluster0.nz8tm.mongodb.net/mu_garden?retryWrites=true&w=majority";
const PORT = 8000;

const eventRouter = require("./routes/eventRouter");
const gardenRouter = require("./routes/gardenRouter");
const postRouter = require("./routes/postRouter");
const taskRouter = require("./routes/taskRouter");
const userRouter = require("./routes/userRouter");

const Event = require("./models/Event");
const Garden = require("./models/Garden");
const Post = require("./models/Post");
const Task = require("./models/Task");
const User = require("./models/User");

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        url: MONGO_URI
    })
}));

app.use("/event", eventRouter);
app.use("/garden", gardenRouter);
app.use("/post", postRouter);
app.use("/task", taskRouter);
app.use("/user", userRouter);

// present views
app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    console.log("GET login");

    if (req.session.user != null) {
        res.redirect("/userpage");
    }

    res.sendFile(__dirname + "/views/login.html");
});

app.get("/userpage", (req, res) => {
    console.log("GET userpage");

    if (req.session.user == null) {
        res.redirect("/login");
        return;
    }

    res.sendFile(__dirname + "/views/userpage.html");
});

app.get("/forum", (req, res) => {
    console.log("GET userpage");

    if (req.session.user == null) {
        res.redirect("/login");
        return;
    }

    res.sendFile(__dirname + "/views/forum.html"); 
});

app.get("/announcements", (req, res) => {
    console.log("GET announcements");

    if (req.session.user == null) {
        res.redirect("/login");
        return;
    }

    res.sendFile(__dirname + "/views/announcements.html"); 
});

app.get("/make-post", (req, res) => {
    console.log("GET make-post");

    if (req.session.user == null) {
        res.redirect("/login");
        return;
    }

    res.sendFile(__dirname + "/views/makePost.html"); 
});

app.get("/volunteer", (req, res) => {
    console.log("GET volunteer");

    if (req.session.user == null) {
        res.redirect("/login");
        return;
    }

    res.sendFile(__dirname + "/views/volunteer.html"); 
});


// get data
app.get("/user-session", async (req, res) => {
    console.log("GET user-session");

    console.log(req.session);

    if (req.session.user == null) {
        res.redirect("/login");
        return;
    }

    let user = await User.findOne({ _id: req.session.user._id });

    if (user == null || user == undefined) {
        res.redirect("/login");
        return;
    }

    user.password = undefined;

    res.json({
        events: await Event.find().sort({ date: -1 }),
        gardens: await Garden.find().sort({ number: 1 }),
        posts: await Post.find({ parent: undefined }).sort({ date: -1 }),
        tasks: await Task.find(),
        user: user,
        currentPost: await Post.findOne({ _id: req.session.currentPost._id })
            .populate("user", "name")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "name -_id"
                }
            }) || null
    });
});

// post.html
app.get("/post/view/:id", async (req, res) => {
    console.log("GET post/view/");

    if (req.session.user == null) {
        res.redirect("/login");
        return;
    }

    let post = await Post.findOne({ _id: req.params.id })
                        .populate("user", "name")
                        .populate({
                            path: "comments",
                            populate: {
                                path: "user",
                                select: "name -_id"
                            }
                        });

    if (post == null || post == undefined) {
        res.redirect("/forum");
        return;
    }

    req.session.currentPost = post;

    res.sendFile(__dirname + "/views/post.html"); 
});


// user signups
/**
 * req.body.name: String
 * req.body.email: String  // if signing up
 * req.body.password: String
 */
app.post("/login", async (req, res) => {
    console.log("POST login... " + req.body);

    let user;

    // create new user for signup
    if (req.body.email) {
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            type: "user",
            posts: [],
            gardens: [],
            tasks: []
        });
    }

    // login existing user
    else {
        user = await User.findOne({ name: req.body.name });
        if (typeof user == "undefined" || typeof user == "null" || user == null) {
            res.send(`User ${req.body.name} does not exist.`);
            return;
        }
        if (user.password != req.body.password) {
            res.send(`Password is incorrect.`);
            return;
        }
    }

    req.session.user = user;
    req.session.save(() => {
        res.redirect("/userpage");
    });
});

app.get("/logout", (req, res) => {
    req.session.user = null;
    req.session.save(() => {
        res.redirect("/login");
    });
});

const listener = httpServer.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});