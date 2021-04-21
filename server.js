const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const httpServer = require("http").Server(app);
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

// PRESENT VIEWS
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

app.get("/user-session", async (req, res) => {
    console.log("GET user-session");

    if (req.session.user == null) {
        res.redirect("/login");
        return;
    }

    let user = await User.findOne({ _id: req.session.user._id });

    user.password = undefined;

    res.json({
        events: await Event.find(),
        gardens: await Garden.find(),
        posts: await Post.find(),
        tasks: await Task.find(),
        user: user
    });
});


// USER SIGNUPS
/**
 * req.body.name: String
 * req.body.email: String  // if signing up
 * req.body.password: String
 */
app.post("/login", async (req, res) => {
    console.log("POST login");

    let user;

    // create new user for signup
    if (req.body.email) {
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
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