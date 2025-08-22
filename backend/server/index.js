const express = require("express");
const serverless = require("serverless-http");

const app = express();

app.get("/", (req, res) => {
    res.send("Server activated ✅");
});

module.exports = app;
module.exports.handler = serverless(app);
