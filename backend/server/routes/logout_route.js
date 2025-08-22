
const express = require("express");
const { mountpath } = require("./sign_routes");

const logout = express();

logout.post("/", (req, res) => {

    res.clearCookie('token', { httpOnly: true });
    res.json({ message: "Logged out successfully" });

});
module.exports = logout;