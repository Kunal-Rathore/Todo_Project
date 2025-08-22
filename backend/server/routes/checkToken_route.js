
const express = require("express");

const checkToken = express();

checkToken.get("/checktoken", (req, res) => {
    const token = req.cookies["token"];
    if (token) {
        res.status(200).json({ message: "ok" }); // token exists and i can also add to check token is valid or not but no issues, in fetch add and delete I am validating token 
    }
    else {
        res.status(400).json({ message: "Token not exists" }); // token is not existing 
    }
});

module.exports = checkToken;