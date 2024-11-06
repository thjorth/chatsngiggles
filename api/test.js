const express = require("express");
const app = express();

app.get("/test", (req, res) => res.send("* This is a test"));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;

