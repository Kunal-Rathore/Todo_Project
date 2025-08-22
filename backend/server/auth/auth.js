
const { checkInputsforSignup, checkInputsforSignin } = require("../validate/zod");
const { checkUserForSignIn } = require("../CRUD/usersModel");
const { generateToken, checkToken } = require("../utils/utils");




async function signUpauth(req, res, next) {

    // input validate zod, then try to store in db by password hashing, then res accordingly (we will manage same data input by try catch)

    const checkInputs_response = checkInputsforSignup(req.body);

    if (!checkInputs_response.success) // if not success then need to response and return (cause no signup possible with wrong input) 
    {

        const errors = checkInputs_response.error.issues.map(err => ({ field: err.path[0], message: err.message }));
        res.status(401).json({ message: errors });
        return;
    }
    else // do signup by storing the data in db by password hasing
    {
        next();
    }

}


async function signInauth(req, res, next) {

    //Input validation, then password hashing, check in DB does exists if yes then return token or invalid inputs 
    try {
        const checkInputs_response = checkInputsforSignin(req.body);
        if (!checkInputs_response.success) // if not success then need to response and return (cause signin not possible with wrong input)
        {
            const errors = checkInputs_response.error.issues.map(err => ({ field: err.path[0], message: err.message }))
            res.status(401).json({ message: errors });
            return;
        }
        else  // do signin by checking  data in db after password hashing using auth
        {
            // now check in userModel using userModel.js
            const userId = await checkUserForSignIn(req.body);
            if (userId) {
                req.token = generateToken(userId.id);
                req.username = userId.username;
                next();  // if the inputs are valid then create a token and return it in the headers
            }
            else {
                res.status(404).json({ message: "User not found" });
            }

        }
    } catch (error) {
        console.log("checkUserForSignIn error- ", error);
        res.status(400).json({ message: error.message });
    }

}


async function Todos(req, res, next) { // to fetchtodos first need to check token is valid or not

    try {
        const token = req.cookies['token'];
        if (!token) {
            res.status(400).json({ message: "No token found" });
            return;
        }
        const decodedToken = checkToken(token); // either have userId or throws error
        req.userId = decodedToken.userId;
        next();
    }
    catch (error) {
        console.log("checkToken error- ", error);
        res.status(400).json({ message: error.message });
    }
}



module.exports = { signInauth, signUpauth, Todos };