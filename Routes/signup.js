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
            res.send("Sign Up Page");
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
})

router.post("/", async (req, res) => {
    try {
        const user = req.body;
        user.pass = bcrypt.hashSync(user.pass, 12);
        const newUser = await pool.query(
            "INSERT INTO USERS VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [user.uname, user.pass, user.firstname, user.lastname, user.phone, user.email]
        );
        
        if(user.type == "customer") {
            await pool.query(
                "INSERT INTO CUSTOMERS VALUES ($1, $2, $3, $4, $5)",
                [user.uname, user.aline1, user.aline2, user.city, user.pin]
            );
        } else if(user.type == "restaurant") {
            await pool.query(
                "INSERT INTO RESTAURANTS VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
                [user.uname, user.fssai, user.rest_name, user.img_link, user.aline1, user.aline2, user.city, user.pin, user.lat, user.long, user.isOpen, null]
            );
            for(let phone of user.phones) {
                await pool.query(
                    "INSERT INTO RESTAURANT_PHONE VALUES ($1, $2)",
                    [user.fssai, phone]
                );
            }
        } else {
            await pool.query(
                "INSERT INTO DELIVERY_PERSONS VALUES ($1, $2, $3, $4, $5)",
                [user.uname, user.vno, user.vmodel, user.vcolour, false]
            );
        }
        res.json(newUser);
    } catch (err) {
        if(err.constraint == "users_pkey") {
            res.status(400).send("Username already exists");
        }
        else {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    }
});

module.exports = router;