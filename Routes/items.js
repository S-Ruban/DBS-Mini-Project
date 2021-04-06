const express = require("express");
const pool = require("../Models/dbConfig");
const {getFSSAI, getSetStatement} = require("../Models/helpers");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        if(req.session.user.type !== "delivery") {
            let query = "", varcount = 0, params = [];
            if(req.session.user.type === "customer") {
                query = `SELECT * FROM FOOD_ITEMS WHERE isAvail = $${++varcount}`;
                params.push(true);
            } else {
                query = `SELECT * FROM FOOD_ITEMS WHERE FSSAI = $${++varcount}`;
                params.push(await getFSSAI(req.session.user.uname));
            }

            if(req.session.user.type === "customer" && req.query.fssai) {
                query += ` AND FSSAI = $${++varcount}`;
                params.push(req.query.fssai);
            } 
            if(req.query.name) {
                query += ` AND ItemName ILIKE $${++varcount}`;
                params.push(`%${req.query.name}%`);
            }
            if(req.query.veg) {
                query += ` AND IsVeg = $${++varcount}`;
                params.push(req.query.veg);
            }
            if(req.query.minPrice) {
                query += ` AND Price >= $${++varcount}`;
                params.push(req.query.minPrice);
            }
            if(req.query.maxPrice) {
                query += ` AND Price <= $${++varcount}`;
                params.push(req.query.maxPrice);
            }
            if(req.body.cuisines.length) {
                let cuisinecount = [];
                for (let i=0; i<req.body.cuisines.length; i++) cuisinecount.push(`$${++varcount}`);
                query += ` AND Cuisine IN (${cuisinecount.join(",")})`
                params.concat(req.body.cuisine);
            }
            if(req.body.mealtypes.length) {
                let mealtypecount = [];
                for (let i=0; i<req.body.mealtypes.length; i++) mealtypecount.push(`$${++varcount}`);
                query += ` AND Mealtype IN (${mealtypecount.join(",")})`
                params.concat(req.body.mealtype);
            }
            const items = await pool.query(query, params);
            res.send(items);
        } else 
            res.status(403).send("Unauthorized");
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

let fssai;
router.use(async (req, res, next) => {
    if(req.session.user.type === "restaurant") {
        fssai = await getFSSAI(req.session.user.uname);
        next();
    }
    else
        res.status(403).send("Unauthorized");
})

router.get("/:item_no", async (req, res) => {
    try {
        const item = await pool.query(
            "SELECT * FROM FOOD_ITEMS WHERE FSSAI = $1 AND ItemNo = $2",
            [fssai, req.params.item_no]
        );
        if(item.rowCount)
            res.send(item)
        else
            res.status(404).send("Item Not Found");
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.post("/", async (req, res) => {
    try {
        let result = await pool.query(
            "SELECT COUNT(*) AS Count FROM FOOD_ITEMS WHERE FSSAI = $1",
            [fssai]
        );
        result = await pool.query(
            "INSERT INTO FOOD_ITEMS VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
            [result.rows[0].count + 1, fssai, req.body.itemname, req.body.img_link, req.body.itemdesc, 
            req.body.isavail, req.body.isveg, req.body.cuisine, req.body.mealtype, req.body.price]
        );
        res.send(result);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.patch("/:item_no", async (req, res) => {
    try {
        let item = await pool.query("SELECT * FROM FOOD_ITEMS WHERE FSSAI = $1 AND ItemNo = $2", [fssai, req.params.item_no]);
        if(item.rowCount) {
            const setItemStatement = getSetStatement(req.body);
            item = await pool.query(
                `UPDATE FOOD_ITEMS ${setItemStatement.query} FSSAI = $${setItemStatement.nextIndex} AND ItemNo = $${setItemStatement.nextIndex + 1} RETURNING *`,
                setItemStatement.params.concat([fssai, req.params.item_no])
            );
            res.send(item);
        } else 
            res.status(404).send("Item not found");
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.delete("/item_no", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM FOOD_ITEMS WHERE FSSAI = $1 AND ItemNo = $2",
            [fssai, req.params.item_no]
        );
        if(result.rowCount)
            res.send("Item Deleted!");
        else
            res.status(404).send("Item not found");
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
})

module.exports = router;