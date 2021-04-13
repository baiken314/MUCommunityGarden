const Garden = require("../models/Garden");

const router = require("express").Router();

router.route("/").get(async (req, res) => {
    console.log("GET garden");
    res.json(await Garden.find());
});

module.exports = router;