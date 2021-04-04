const express = require("express");
const pool = require("../Models/dbConfig");
const {setStatement} = require("../Models/helpers");

const router = express.Router();

router.get("/", (req, res) => {
    try {
        res.send("Profile page");
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.patch("/", async (req, res) => {
    try {
        const patch = req.body;
        
        let updatedUser = null;
        if(Object.keys(patch.user).length) {
            const setUserStatement = setStatement(patch.user);
            updatedUser = await pool.query(
                `UPDATE USERS ${setUserStatement.query} WHERE uname = $${setUserStatement.nextIndex}`,
                setUserStatement.params.concat([req.session.user.uname])
            );
        }

        let updatedType = null;
        if(Object.keys(patch.type).length) {
            const setTypeStatement = setStatement(patch.type);
            if(req.session.user.type === "customer") {
                updatedType = await pool.query(
                    `UPDATE CUSTOMERS ${setTypeStatement.query} WHERE Cust_Uname = $${setTypeStatement.nextIndex}`,
                    setTypeStatement.params.concat([req.session.user.uname])
                );
            } else if(req.session.user.type === "restaurant") {
                updatedType = await pool.query(
                    `UPDATE RESTAURANTS ${setTypeStatement.query} WHERE Rest_Uname = $${setTypeStatement.nextIndex}`,
                    setTypeStatement.params.concat([req.session.user.uname])
                );
            } else {
                updatedType = await pool.query(
                    `UPDATE DELIVERY_PERSONS ${setTypeStatement.query} WHERE Del_Uname = $${setTypeStatement.nextIndex}`,
                    setTypeStatement.params.concat([req.session.user.uname])
                );
            }
        }
        
        res.send({updatedUser, updatedType});
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.delete("/", async (req, res) => {
    try {
        uname = req.session.user.uname;
        req.session.destroy();
        await pool.query(
            "DELETE FROM USERS WHERE UNAME = $1",
            [uname]
        );
        res.send("Profile deleted");
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.post("/:phone", async (req, res) => {
    try {
        if(req.session.user.type !== "restaurant")
            res.status(401).send("Authorized only for restaurants");
        else {
            const fetch = await pool.query(
                "SELECT * FROM RESTAURANTS WHERE Rest_Uname = $1",
                [req.session.user.uname]
            );
            const fssai = fetch.rows[0].fssai;
            const added = await pool.query(
                "INSERT INTO RESTAURANT_PHONE VALUES($1, $2) RETURNING *",
                [fssai, req.params.phone]
            );
            res.send(added);
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.delete("/:phone", async (req, res) => {
    try {
        if(req.session.user.type !== "restaurant")
            res.status(401).send("Authorized only for restaurants");
        await pool.query(
            "DELETE FROM RESTAURANT_PHONE WHERE Phone = $1",
            [req.params.phone]
        );
        res.send("Successfully deleted!");
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
})

module.exports = router;