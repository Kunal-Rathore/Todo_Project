
const express = require("express");
const { Todos } = require("../auth/auth");
const { findInUserModel } = require("../CRUD/usersModel");

const checkToken = express();

checkToken.get("/checktoken", Todos, async (req, res) => {

    try {
        const userId = req.userId;
        const userData = await findInUserModel(userId);
        res.status(200).json({ username: userData.username, message: "ok" });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

module.exports = checkToken;