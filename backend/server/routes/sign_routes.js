

// post-> signup, signin

const express = require("express");
const { signInauth, signUpauth } = require("../auth/auth.js");
const { storeUser } = require("../CRUD/usersModel");

const signup_in = express();
signup_in.use(express.json());

//signup route ->  Input validation ->  password hashing -> storeIn Db (catch if user already Exists)
{
    signup_in.post("/signup", signUpauth, async (req, res) => {

        try {
            await storeUser(req.body);  // *here I got stucked getting server failure because I didn't await it
            res.status(200).json({ message: "Signup successfull" });

        } catch (error) {
            console.log("storeUser error- ", error);
            res.status(400).json({ message: error.message });
        }
    });
}


// signin route  -> Input validation -> password hashing -> check in Db (auth) -> return token/ return user not found
{
    signup_in.post("/signin", signInauth, (req, res) => {

        // after auth
        // generate token 
        const token = req.token;
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
        });
        res.json({ message: "Signin successfull" });

    });
}

module.exports = signup_in;