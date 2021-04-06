require("dotenv").config()
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./Models/dbConfig");
const {auth, unauth, authCustomer} = require("./auth");
const signup = require("./Routes/signup");
const signin = require("./Routes/signin");
const profile = require("./Routes/profile");
const orders = require("./Routes/orders");
const items = require("./Routes/items");
const restaurants = require("./Routes/restaurants");

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
});

app.get("/dashboard", auth, (req, res) => {
    try {
        res.send(`Welcome to Dashboard ${req.session.user.uname}!`);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

app.use("/signin", unauth, signin);
app.use("/signup", unauth, signup);
app.use("/profile", auth, profile);
app.use("/orders", authCustomer, orders);
app.use("/items", auth, items);
app.use("/restaurants", authCustomer, restaurants);

app.get("/signout", auth, (req, res) => {
    req.session.destroy();
    res.send("Signed Out!");
});

app.use((req, res) => {
    res.status(404).send("Page not found");
});