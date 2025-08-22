
const bcrypt = require("bcrypt");
const { usersModel } = require("../db/db");



async function storeUser(data) {
    // here first need to hash password, then store in db
    const hashedPassword = await bcrypt.hash(data.password, 5); // generates the hashed password by salting 5rounds

    await usersModel.create({
        firstname: data.firstname,
        lastname: data.lastname,
        username: data.username,
        email: data.email,
        password: hashedPassword
    });

} // if fails throws error

async function checkUserForSignIn(data) {

    // here first need to check email in db then password with the password stored in db, then return it
    const response = await usersModel.findOne({
        email: data.email
    });

    // if response true means email correct then check password
    if (response) {
        const isValid = await bcrypt.compare(data.password, response.password);  // it check whether the input password and stored in db is correct or not

        if (isValid) {
            return { id: response._id }; // return id to create token
        }
        else {
            throw new Error("Password Incorrect");

        }
    }
    return false;
}

async function findInUserModel(userId) {
    const result = await usersModel.findOne({
        _id: userId
    });
    if (result) {
        return result;
    }
    else {
        throw new Error("Not found");

    }
}


module.exports = { storeUser, checkUserForSignIn, findInUserModel };