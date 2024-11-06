const express = require("express");
const path = require('path');
const app = express();

app.get("/static/:path", (req, res) => {
    console.log(req.query)
    res.sendFile(path.join(__dirname, "static", req.query.path));
});

module.exports = app;
