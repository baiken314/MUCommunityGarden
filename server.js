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
    req.session.randomKey = req.session.randomKey || Math.random();
    res.send(`Server running on ${PORT}, your session key is ${req.session.randomKey}`);
});

app.get("/login", (req, res) => {
    
});

// USER SIGNUPS
app.post("/sign-up", (req, res) => {

});

app.post("/login", (req, res) => {

});

const listener = httpServer.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});