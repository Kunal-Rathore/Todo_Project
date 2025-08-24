
const express = require("express");

const logout = express.Router();

logout.post("/", (req, res) => {

    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: "none" });
    return res.status(200).json({ message: "Logged out successfully" });

});
module.exports = logout;