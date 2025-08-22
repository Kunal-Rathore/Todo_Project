
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_TOKEN;
const jwt_expiry = process.env.JWT_EXPIRY;

function generateToken(userId) {

    return jwt.sign({ userId: userId }, jwt_secret, { expiresIn: jwt_expiry }); // generates the token
}

function checkToken(token) {
    return jwt.verify(token, jwt_secret);
}

module.exports = { generateToken, checkToken };