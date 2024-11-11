const express = require("express");
const nocache = require('nocache');
const path = require('path');

const app = express();
app.use(nocache());
app.set('etag', false); 

app.get("/static/:path*", (req, res) => {
    console.log(req.query)
    res.sendFile(path.join(__dirname, "static", req.query.path));
});

module.exports = app;
