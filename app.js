require("dotenv").config()
const express = require("express");
const signup = require("./Routes/signup");

const app = express();
port = process.env.SERVER_PORT
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
app.use(express.json());

app.get("/", (req, res) => {
    res.json({message: "Hello World"});
})

app.use('/signup', signup);