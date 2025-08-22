
const mongoose = require("mongoose");
const schema = mongoose.Schema;
mongoose.connect(process.env.MONGO_URL);

const users = new schema({
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
});

const todos = new schema({
    title: { type: String },
    isDone: { type: Boolean },
    userId: { type: String },
    date: { type: Date, default: Date.now }
});


const usersModel = mongoose.model("users", users);
const todosModel = mongoose.model("todos", todos);


module.exports = { usersModel, todosModel };