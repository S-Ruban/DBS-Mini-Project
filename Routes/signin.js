const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../Models/db");
const auth = require("../auth");

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
                uname: credentials.uname
            }
            res.send(req.session);
        }
        else
            res.send("Impostor");
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});


module.exports = router;