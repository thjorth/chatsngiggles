const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Express on Vercel #1"));

module.exports = app;

