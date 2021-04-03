const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../Models/db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        if(req.query.uname) {
            const users = await pool.query(
                "SELECT * FROM USERS WHERE UNAME = $1",
                [req.query.uname]
            );
            res.json(users.rowCount);
        } else
            res.json("Sign Up Page");
    } catch (err) {
        console.error(err.message);
    }
})

router.post("/", async (req, res) => {
    try {
        const user = req.body;
        user.pass = bcrypt.hashSync(user.pass, 12);
        const newUser = await pool.query(
            "INSERT INTO USERS (UNAME, PASS, FIRSTNAME, LASTNAME, PHONE, EMAIL) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [user.uname, user.pass, user.firstname, user.lastname, user.phone, user.email]
        );
        res.json(newUser);
    } catch (err) {
        if(err.constraint == "users_pkey")
            res.json("Username already exsits");
        else
            console.error(err.message);
    }
});

module.exports = router;