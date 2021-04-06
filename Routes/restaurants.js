const express = require("express");
const pool = require("../Models/dbConfig");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let query = "SELECT * FROM RESTAURANTS R WHERE isOpen = $1";
        let varcount = 1, params = [true];
        if(req.query.name) {
            query += ` AND Rest_Name ILIKE $${++varcount}`;
            params.push(`%${req.query.name}%`);
        }
        if(req.query.veg) {
            query += ` AND NOT EXISTS (SELECT * FROM FOOD_ITEMS FI WHERE FI.FSSAI = R.FSSAI AND FI.isVeg = $${++varcount})`;
            params.push(false);
        }
        if(req.body.cuisines.length) {
            let cuisinecount = [];
            for (let i=0; i<req.body.cuisines.length; i++) cuisinecount.push(`$${++varcount}`);
            query += ` AND EXISTS ( SELECT * FROM FOOD_ITEMS FI WHERE FI.FSSAI = R.FSSAI AND FI.Cuisine IN (${cuisinecount.join(",")}))`
            params.concat(req.body.cuisine);
        }
        if(req.body.mealtypes.length) {
            let mealtypecount = [];
            for (let i=0; i<req.body.mealtypes.length; i++) mealtypecount.push(`$${++varcount}`);
            query += ` AND EXISTS ( SELECT * FROM FOOD_ITEMS FI WHERE FI.FSSAI = R.FSSAI AND FI.Mealtype IN (${mealtypecount.join(",")}))`
            params.concat(req.body.mealtype);
        }
        const restaurants = await pool.query(query, params);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.get("/:fssai", async (req, res) => {
    try {
        const restaurant = await pool.query("SELECT * FROM RESTAURANT WHERE FSSAI = $1", [req.params.fssai]);
        if(rowCount)
            res.send(restaurant);
        else
            res.status(404).send("Restaurant not found");
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

module.exports = router;