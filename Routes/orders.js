const express = require('express');
const pool = require('../Models/dbConfig');
const { getRestUname, getFSSAI } = require('../Models/helpers');
const { getSocketID } = require('../socket');

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		if (req.session.user.type === 'customer') {
			const orders = await pool.query(
				`
                SELECT OrderNo AS Order_No, OrderTime As Order_Time, Rest_Name AS Restaurant, FirstName AS Delivery, SUM(Quantity) AS Quantity, (SUM(Quantity*Price) + Del_Charge) AS Price
				FROM ((((SELECT * FROM ORDERS WHERE Cust_Uname = $1 AND isPaid = $2) AS CUSTOMER 
					NATURAL JOIN ORDER_CONTENTS) 
					NATURAL JOIN FOOD_ITEMS) 
					NATURAL JOIN RESTAURANTS) 
					JOIN USERS ON Del_Uname = Uname 
				GROUP BY ( Order_No, Order_Time, Restaurant, Delivery, Del_Charge)
				ORDER BY Order_Time DESC;
                `,
				[req.session.user.uname, true]
			);
			res.send(orders.rows);
		} else if (req.session.user.type === 'restaurant') {
			const orders = await pool.query(
				`
                SELECT OrderNo AS Order_No, OrderTime AS Order_Time, Cust_FirstName AS Customer, Del_FirstName AS Delivery, SUM(Quantity) AS Quantity, (SUM(Quantity*Price) + Del_Charge) AS Price 
				FROM (((SELECT * FROM ORDERS WHERE FSSAI = $1 AND isPaid = $2) AS RESTAURANT 
						NATURAL JOIN ORDER_CONTENTS) 
						NATURAL JOIN FOOD_ITEMS) 
						NATURAL JOIN (SELECT Uname AS Cust_Uname, FirstName AS Cust_FirstName FROM USERS) AS CUSTOMER_NAMES 
						NATURAL JOIN (SELECT Uname AS Del_Uname, FirstName AS Del_FirstName FROM USERS) AS DELIVERY_NAMES
				GROUP BY ( Order_No, Order_Time, Customer, Delivery, Del_Charge)
				ORDER BY Order_Time DESC;
                `,
				[await getFSSAI(req.session.user.uname), true]
			);
			res.send(orders.rows);
		} else {
			const orders = await pool.query(
				`
                SELECT OrderNo AS Order_No, OrderTime AS Order_Time, FirstName AS Customer, Rest_Name AS Restaurant, SUM(Quantity) AS Quantity, Del_Charge AS Price
				FROM ((((SELECT * FROM ORDERS WHERE Del_Uname = $1 AND isPaid = $2) AS DELIVERY_PERSON 
						NATURAL JOIN ORDER_CONTENTS) 
						NATURAL JOIN FOOD_ITEMS) 
						NATURAL JOIN RESTAURANTS) 
						JOIN USERS ON Cust_Uname = Uname
				GROUP BY ( Order_No, Order_Time, Customer, Restaurant, Del_Charge)
				ORDER BY Order_Time DESC;
                `,
				[req.session.user.uname, true]
			);
			res.send(orders.rows);
		}
	} catch (err) {
		console.log(err.stack);
		res.status(500).send({ message: err.message, stack: err.stack });
	}
});

router.get('/:order_no', async (req, res) => {
	try {
		const order = await pool.query(
			'SELECT * FROM ORDERS WHERE OrderNo = $1 AND isPlaced = $2',
			[req.params.order_no, true]
		);
		if (!order.rowCount) res.status(404).send({ message: 'Order does not exist' });
		else if (
			(req.session.user.type === 'customer' &&
				req.session.user.uname === order.rows[0].cust_uname) ||
			(req.session.user.type === 'delivery' &&
				req.session.user.uname === order.rows[0].del_uname) ||
			(req.session.user.type === 'restaurant' &&
				req.session.user.uname === (await getRestUname(order.rows[0].fssai)))
		) {
			const customer = await pool.query(
				'SELECT * FROM USERS, CUSTOMERS WHERE Cust_Uname = $1 AND Cust_Uname = Uname',
				[order.rows[0].cust_uname]
			);
			const restaurant = await pool.query('SELECT * FROM RESTAURANTS WHERE FSSAI = $1', [
				order.rows[0].fssai
			]);
			const delivery = await pool.query(
				'SELECT * FROM USERS, DELIVERY_PERSONS WHERE Del_Uname = $1 AND Del_Uname = Uname',
				[order.rows[0].del_uname]
			);
			const orderContent = await pool.query(
				`
                SELECT FI.ItemName, FI.Price, OC.Quantity FROM ORDER_CONTENTS OC, FOOD_ITEMS FI;
				WHERE OC.OrderNo = $1 AND OC.ItemNo = FI.ItemNo AND OC.FSSAI = FI.FSSAI;
                `,
				[req.params.order_no]
			);
			res.send({
				order: order.rows[0],
				orderContent: orderContent.rows,
				customer: customer.rows[0],
				restaurant: restaurant.rows[0],
				delivery: delivery.rows[0]
			});
		} else res.status(403).send({ message: 'Unauthorized' });
	} catch (err) {
		console.log(err.stack);
		res.status(500).send({ message: err.message, stack: err.stack });
	}
});

router.delete('/:order_no', async (req, res) => {
	try {
		const order = await pool.query(
			'SELECT * FROM ORDERS WHERE OrderNo = $1 AND isPlaced = $2',
			[req.params.order_no, true]
		);
		if (!order.rowCount) res.status(404).send({ message: 'Order does not exist' });
		else if (order.rows[0].isPrepared) {
			res.status(403).send({
				message: 'Cannot cancel order after prepared.'
			});
		} else {
			await pool.query('DELETE FROM ORDERS WHERE OrderNo = $1', [req.params.order_no]);
			res.send({ message: 'Cancelled Order!' });
		}
	} catch (err) {
		console.log(err.stack);
		res.status(500).send({ message: err.message, stack: err.stack });
	}
});

router.patch('/:order_no', async (req, res) => {
	try {
		let order = await pool.query('SELECT * FROM ORDERS WHERE OrderNo = $1 AND isPlaced = $2', [
			req.params.order_no,
			true
		]);
		if (!order.rowCount) res.status(404).send({ message: 'Order does not exist' });
		else if (
			(req.session.user.type === 'customer' &&
				req.session.user.uname === order.rows[0].cust_uname) ||
			(req.session.user.type === 'delivery' &&
				req.session.user.uname === order.rows[0].del_uname) ||
			(req.session.user.type === 'restaurant' &&
				req.session.user.uname === (await getRestUname(order.rows[0].fssai)))
		) {
			const rest_uname = await getRestUname(order.rows[0].fssai);
			let eventType = null,
				columnType = null;
			if (req.body.isPrepared) {
				eventType = 'prepared';
				columnType = 'isPrepared';
			} else if (req.body.isReceived) {
				eventType = 'received';
				columnType = 'isReceived';
			} else if (req.body.isDelivered) {
				eventType = 'delivered';
				columnType = 'isDelivered';
			} else if (req.body.isPaid) {
				eventType = 'paid';
				columnType = 'isPaid';
			}

			order = await pool.query(`UPDATE ORDERS SET ${columnType} = $1 WHERE OrderNo = $2`, [
				true,
				req.params.order_no
			]);
			if (req.body.isDelivered) {
				await pool.query('UPDATE DELIVERY_PERSONS SET isAvail = $1 WHERE Del_Uname = $2', [
					true,
					order.rows[0].del_uname
				]);
			}

			if (getSocketID(order.rows[0].cust_uname))
				req.app.get('io').to(getSocketID(order.rows[0].cust_uname)).emit(eventType, true);
			if (getSocketID(rest_uname))
				req.app.get('io').to(getSocketID(rest_uname)).emit(eventType, true);
			if (getSocketID(order.rows[0].del_uname))
				req.app.get('io').to(getSocketID(order.rows[0].del_uname)).emit(eventType, true);

			res.send(order.rows[0]);
		} else res.status(403).send({ message: 'Unauthorized' });
	} catch (err) {
		console.log(err.stack);
		res.status(500).send({ message: err.message, stack: err.stack });
	}
});

module.exports = router;
