require("dotenv").config()
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./Models/dbConfig");
const auth = require("./auth");
const signup = require("./Routes/signup");
const signin = require("./Routes/signin");
const profile = require("./Routes/profile");
const orders = require("./Routes/orders");
const items = require("./Routes/items");

const app = express();
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Listening on port ${process.env.SERVER_PORT}`);
})

const sessionConfig = {
    store: new pgSession({
        pool,
        tableName: "user_sessions"
    }),
    secret: process.env.SECRET,
    cookie: {
        maxAge: 1000*60*60,
        secure: (process.env.MODE !== "development"),
        httpOnly: true
    },
    resave: false,
    saveUninitialized: true
};

app.use(express.json());
app.use(session(sessionConfig));

app.get("/", (req, res) => {
    if(req.session && req.session.user) 
        res.redirect("/dashboard");
    else
        res.redirect("/signin");
})

app.use("/signin", auth.unauth, signin);
app.use("/signup", auth.unauth, signup);
app.use("/profile", auth.auth, profile);
app.use("/orders", auth.authCustomer, orders);
app.use("/items", auth.auth, items);

app.get("/dashboard", auth.auth, (req, res) => {
    try {
        res.send(`Welcome to Dashboard ${req.session.user.uname}!`);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
})

app.get("/signout", auth.auth, (req, res) => {
    req.session.destroy();
    res.send("Signed Out!");
});