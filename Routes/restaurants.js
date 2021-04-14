const express = require('express');
const pool = require('../Models/dbConfig');

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		console.log(req.query);
		let query = 'SELECT * FROM RESTAURANTS R WHERE isOpen = $1';
		let varcount = 1;
		let params = [true];
		if (req.query.name) {
			query += ` AND Rest_Name ILIKE $${++varcount}`;
			params.push(`%${req.query.name}%`);
		}
		if (req.query.veg === 'true') {
			query += ` AND R.isVeg = $${++varcount}`;
			params.push(true);
		}
		if (req.query.cuisines && req.query.cuisines.length) {
			const cuisinecount = [];
			for (let i = 0; i < req.query.cuisines.length; i++) cuisinecount.push(`$${++varcount}`);
			query += ` AND EXISTS ( SELECT * FROM FOOD_ITEMS FI WHERE FI.FSSAI = R.FSSAI AND FI.Cuisine IN (${cuisinecount.join(
				','
			)}))`;
			params = params.concat(req.query.cuisines);
		}
		if (req.query.mealTypes && req.query.mealTypes.length) {
			const mealtypecount = [];
			for (let i = 0; i < req.query.mealTypes.length; i++)
				mealtypecount.push(`$${++varcount}`);
			query += ` AND EXISTS ( SELECT * FROM FOOD_ITEMS FI WHERE FI.FSSAI = R.FSSAI AND FI.Mealtype IN (${mealtypecount.join(
				','
			)}))`;
			params = params.concat(req.query.mealTypes);
		}
		const restaurants = await pool.query(query, params);
		res.send(restaurants.rows);
	} catch (err) {
		console.log(err.stack);
		res.status(500).send({ message: err.message, stack: err.stack });
	}
});

router.get('/:fssai', async (req, res) => {
	try {
		const restaurant = await pool.query('SELECT * FROM RESTAURANT WHERE FSSAI = $1', [
			req.params.fssai
		]);
		if (restaurant.rowCount) res.send(restaurant);
		else res.status(404).send('Restaurant not found');
	} catch (err) {
		console.log(err.stack);
		res.status(500).send({ message: err.message, stack: err.stack });
	}
});

module.exports = router;
