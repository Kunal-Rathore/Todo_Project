require("dotenv").config();

const rateLimit = require("express-rate-limit");
const express = require("express");
const cors = require("cors");
const signup_in = require("./routes/sign_routes");
const todos = require("./routes/todos_routes");
const logout = require("./routes/logout_route");
const checkToken = require("./routes/checkToken_route");
const cookieParser = require("cookie-parser");

const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "https://todo-project-git-main-kunal-rathores-projects-3c5b48fa.vercel.app",
    credentials: true,
    sameSite: 'None',
    secure: true
}));

app.use(rateLimit({
    windowMs: 1000 * 60 * 15, max: 400,
    message: {
        message: "To many requests from the same Ip try again after 15 mints"
    },
    skip: (req) => req.method === "OPTIONS" // skip the rateLimit for OPTIONS method
})); // limit only 25 request per ip, in 15mints


app.use('/issignedin', checkToken);   // to check does token exists
app.use('/sign', signup_in);         // route which handels signup and signin 
app.use('/todos', todos);           // route which handels todos operations 
app.use('/logout', logout);

app.get('/', (req, res) => {
    res.send("Server activated");
})


app.listen(3000);