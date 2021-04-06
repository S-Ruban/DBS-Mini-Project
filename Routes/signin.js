const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../Models/dbConfig");

const router = express.Router();

router.get("/", (req, res) => {
    try {
        res.send("Sign In Page");
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.post("/", async (req, res) => {
    try {
        const credentials = req.body;
        const pass = await pool.query(
            "SELECT * FROM USERS WHERE UNAME = $1",
            [credentials.uname]
        );

        if(pass.rowCount && bcrypt.compareSync(credentials.pass, pass.rows[0].pass)) {
            req.session.user = {
                uname: credentials.uname,
                type: await getType(credentials.uname)
            }
            res.status(202).send(req.session);
        }
        else
            res.send("Impostor");
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

const getType = async (uname) => {
    try {
        let user = null;
        user = await pool.query(
            "SELECT * FROM CUSTOMERS WHERE Cust_Uname = $1",
            [uname]
        );
        if(user.rowCount)
            return "customer"

        user = await pool.query(
            "SELECT * FROM RESTAURANTS WHERE Rest_Uname = $1",
            [uname]
        );
        if(user.rowCount)
            return "restaurant"
        else
            return "delivery"
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
}

module.exports = router;