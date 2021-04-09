const express = require('express');
const pool = require('../Models/dbConfig');

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const cart = await pool.query(
			`
            SELECT OrderNo AS Order_No, Rest_Name As Restaurant, ItemName, Price, Quantity 
			FROM (((SELECT * FROM ORDERS WHERE Cust_Uname = $1 AND isPlaced = $2) AS CART
					NATURAL JOIN ORDER_CONTENTS) 
					NATURAL JOIN FOOD_ITEMS) 
					NATURAL JOIN RESTAURANTS;
            `,
			[req.session.user.uname, false]
		);
		res.send(cart.rows);
	} catch (err) {
		console.log(err.stack);
		res.status(500).send({ message: err.message, stack: err.stack });
	}
});

router.post('/', async (req, res) => {
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		const cart = await client.query(
			'SELECT * FROM ORDERS WHERE Cust_Uname = $1 AND isPlaced = $2',
			[req.session.user.uname, false]
		);
		if (cart.rowCount) res.status(406).send({ message: 'Cart is Empty' });
		else {
			const order = await client.query(
				'UPDATE ORDERS SET isPlaced = $1, OrderTime = $2 WHERE OrderNo = $3 RETURNING *',
				[true, new Date().getTime(), cart.rows[0].orderno]
			);

			const customer = await client.query(
				'SELECT lat as latitutde, long as longitude FROM CUSTOMERS WHERE Cust_Uname = $1',
				[cart.rows[0].cust_uname]
			);
			const restaurant = await client.query(
				'SELECT lat as latitude, long as longitude FROM RESTAURANTS WHERE FSSAI = $1',
				[cart.rows[0].fssai]
			);
			await req.app.get('workerUtils').addJob(
				'assignDelivery',
				{
					orderNo: cart.rows[0].orderno,
					cust_loc: customer.rows[0],
					rest_loc: restaurant.rows[0]
				},
				{ maxAttemps: 5 }
			);
			await client.query('COMMIT');
			res.status(201).send(order.rows[0]);
		}
	} catch (err) {
		await client.query('ROLLBACK');
		console.log(err.stack);
		res.status(500).send({ message: err.message, stack: err.stack });
	} finally {
		client.release();
	}
});

router.delete('/', async (req, res) => {
	try {
		await pool.query(
			'DELETE FROM ORDERS WHERE Cust_Uname = $1 AND isPlaced = $2',
			[req.session.user.uname, false]
		);
		res.send({ message: 'Cart emptied' });
	} catch (err) {
		console.log(err.stack);
		res.status(500).send({ message: err.message, stack: err.stack });
	}
});

let cart;
router.use(async (req, res, next) => {
	cart = await pool.query(
		'SELECT * FROM ORDERS WHERE Cust_Uname = $1 AND isPlaced = $2',
		[req.session.user.uname, false]
	);
	next();
});

router.post('/:item_no', async (req, res) => {
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		if (!cart.rowCount) {
			cart = await client.query(
				`
                INSERT INTO ORDERS (OrderTime, IsPlaced, IsAssigned, IsPrepared, IsReceived, IsDelivered, IsPaid, Cust_Uname, FSSAI) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                `,
				[
					new Date().getTime(),
					false,
					false,
					false,
					false,
					false,
					false,
					req.session.user.uname,
					req.body.fssai
				]
			);
		}

		let item = await client.query(
			'SELECT * FROM ORDER_CONTENTS WHERE OrderNo = $1 AND ItemNo = $2 AND FSSAI = $3',
			[cart.rows[0].orderno, req.params.item_no, req.body.fssai]
		);
		if (item.rowCount) {
			item = await client.query(
				'UPDATE ORDER_CONTENTS SET Quantity = Quantity + 1 WHERE OrderNo = $1 AND ItemNo = $2 AND FSSAI = $3 RETURNING *',
				[cart.rows[0].orderno, req.params.item_no, req.body.fssai]
			);
		} else {
			item = await client.query(
				'INSERT INTO ORDER_CONTENTS VALUES ($1, $2, $3, $4) RETURNING *',
				[cart.rows[0].orderno, req.params.item_no, req.body.fssai, 1]
			);
		}
		client.query('COMMIT');
		res.status(201).send(item.rows[0]);
	} catch (err) {
		client.query('ROLLBACK');
		console.log(err.stack);
		res.status(500).send({ message: err.message, stack: err.stack });
	} finally {
		client.release();
	}
});

router.delete('/:item_no', async (req, res) => {
	try {
		if (!cart.rowCount) res.status(404).send({ message: 'Cart is empty' });
		else {
			const item = await pool.query(
				'DELETE FROM ORDER_CONTENTS WHERE OrderNo = $1 AND ItemNo = $2 AND FSSAI = $3',
				[cart.rows[0].orderno, req.params.item_no, req.body.fssai]
			);
			if (item.rowCount) res.send({ message: 'Item removed' });
			else res.status(404).send({ message: 'Item not in cart' });
		}
	} catch (err) {
		console.log(err.stack);
		res.status(500).send({ message: err.message, stack: err.stack });
	}
});

router.patch('/:item_no', async (req, res) => {
	try {
		if (!cart.rowCount) res.status(404).send({ message: 'Cart is empty' });
		else {
			const item = await pool.query(
				'UPDATE ORDER_CONTENTS SET Quantity = $1 WHERE OrderNo = $2 AND ItemNo = $3 AND FSSAI = $4 RETURNING *',
				[
					req.body.quantity,
					cart.rows[0].orderno,
					req.params.item_no,
					req.body.fssai
				]
			);
			if (item.rowCount) res.send(item.rows[0]);
			else res.status(404).send({ message: 'Item does not exist' });
		}
	} catch (err) {
		console.log(err.stack);
		res.status(500).send({ message: err.message, stack: err.stack });
	}
});

module.exports = router;
