
const express = require("express");
const { checkTokenValid } = require("../middlewares/auth");
const { findInUserModel } = require("../CRUD/usersModel");

const checkToken = express.Router();

checkToken.get("/checktoken", checkTokenValid, async (req, res) => {

    try {
        const userId = req.userId;
        const userData = await findInUserModel(userId);
        return res.status(200).json({ username: userData.username, message: "ok" });
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
});

module.exports = checkToken;