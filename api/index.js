const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Express on Vercel #1"));

app.get("/test", (req, res) => res.send("<h1>This is a test</h1>"));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;

