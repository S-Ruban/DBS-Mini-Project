const express = require("express");
const pool = require("../Models/dbConfig");
const {getRestUName, getSetStatement} = require("../Models/helpers");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        if(req.session.user.type === "customer") {
            const orders = await pool.query(
                `
                SELECT O.OrderNo AS Order_No, O.OrderTime As Order_Time, O.isPaid AS isCompleted, R.Rest_Name AS Restaurant, U.FirstName AS Delivery, SUM(OC.Quantity) AS Quantity, (SUM(OC.Quantity*FI.Price) + O.Del_Charge) AS Price
                FROM ORDERS O, ORDER_CONTENTS OC, FOOD_ITEMS FI, RESTAURANTS R, USERS U
                WHERE
                    O.Cust_Uname = $1 AND 
                    O.FSSAI = R.FSSAI AND
                    O.Del_Uname = U.Uname AND 
                    OC.OrderNo = O.OrderNo AND 
                    FI.ItemNo = OC.ItemNo AND 
                    FI.FSSAI = O.FSSAI 
                GROUP BY ( Order_No, Order_Time, isCompleted, Restaurant, Delivery);
                `,
                [req.session.user.uname]
            );
            res.send(orders.rows);
        } else if (req.session.user.type === "restaurant") {
            const orders = await pool.query(
                `
                SELECT O.OrderNo AS Order_No, O.OrderTime AS Order_Time, O.isPaid  AS isCompleted, U1.FirstName AS Customer, U2.FirstName AS Delivery, SUM(OC.Quantity) AS Quantity, (SUM(OC.Quantity*FI.Price) + O.Del_Charge) AS Price 
                FROM ORDERS O, ORDER_CONTENTS OC, FOOD_ITEMS FI, RESTAURANTS R, USERS U1, USERS U2
                WHERE
                    R.Rest_Uname = $1 AND 
                    O.FSSAI = R.FSSAI AND 
                    O.Cust_Uname = U1.Uname AND 
                    O.Del_Uname = U2.Uname AND 
                    OC.OrderNo = O.OrderNo AND 
                    FI.ItemNo = OC.ItemNo AND 
                    FI.FSSAI = O.FSSAI 
                GROUP BY ( Order_No, Order_Time, isCompleted, Customer, Delivery);
                `,
                [req.session.user.uname]
            );
            res.send(orders.rows);
        } else {
            const orders = await pool.query(
                `
                SELECT O.OrderNo AS Order_No, O.OrderTime AS Order_Time, O.isPaid  AS isCompleted, U.FirstName AS Customer, R.Rest_Name AS Restaurant, SUM(OC.Quantity) AS Quantity, O.Del_Charge AS Price
                FROM ORDERS O, ORDER_CONTENTS OC, FOOD_ITEMS FI, RESTAURANTS R, USERS U
                WHERE
                    O.Del_Uname = $1 AND
                    O.Cust_Uname = U.Uname AND 
                    O.FSSAI = R.FSSAI AND 
                    OC.OrderNo = O.OrderNo AND 
                    FI.ItemNo = OC.ItemNo AND 
                    FI.FSSAI = O.FSSAI 
                GROUP BY ( Order_No, Order_Time, isCompleted, Customer, Restaurant);
                `,
                [req.session.user.uname]
            );
            res.send(orders.rows);
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.get("/:order_no", async (req, res) => {
    try {
        const order = await pool.query(
            "SELECT * FROM ORDERS WHERE OrderNo = $1",
            [req.params.order_no]
        );
        if(!order.rowCount)
            res.status(404).send("Order does not exist");
        else if(
            (req.session.user.type === "customer" && req.session.user.uname === order.rows[0].cust_uname) ||
            (req.session.user.type === "delivery" && req.session.user.uname === order.rows[0].del_uname) ||
            (req.session.user.type === "restaurant" && req.session.user.uname === await getRestUName(order.rows[0].fssai))
        ) {
            const customer = await pool.query("SELECT * FROM CUSTOMERS WHERE Cust_Uname = $1", [order.rows[0].cust_uname]);
            const restaurant = await pool.query("SELECT * FROM RESTAURANTS WHERE Rest_Uname = $1", [await getRestUName(order.rows[0].fssai)]);
            const delivery = await pool.query("SELECT * FROM DELIVERY_PERSONS WHERE Del_Uname = $1", [order.rows[0].del_uname]);
            const order_content = await pool.query(
                `
                SELECT FI.ItemName, FI.Price, OC.Quantity FROM ORDER_CONTENTS OC, FOOD_ITEMS FI
                WHERE OC.OrderNo = $1 AND OC.ItemNo = FI.ItemNo AND OC.FSSAI = FI.FSSAI;
                `,
                [order_no]
            );
            res.send({order, order_content, customer, restaurant, delivery});
        } else {
            res.status(403).send("Unauthorized");
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.delete("/:order_no", async (req, res) => {
    try {
        const order = await pool.query(
            "SELECT * FROM ORDERS WHERE OrderNo = $1",
            [req.params.order_no]
        );
        if(!order.rowCount)
            res.status(404).send("Order does not exist");
        else if(order.rows[0].isPrepared)
            res.status(403).send("Cannot cancel order after prepared.");
        else {
            await pool.query(
                "DELETE FROM ORDERS WHERE OrderNo = $3",
                [req.params.order_no]
            );
            res.send("Cancelled Order!");
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});

router.patch("/:order_no", async (req, res) => {
    try {
        let order = await pool.query( "SELECT * FROM ORDERS WHERE OrderNo = $1", [req.params.order_no]);
        if(!order.rowCount)
            res.status(404).send("Order does not exist");
        else if(
            (req.session.user.type === "customer" && req.session.user.uname === order.rows[0].cust_uname) ||
            (req.session.user.type === "delivery" && req.session.user.uname === order.rows[0].del_uname) ||
            (req.session.user.type === "restaurant" && req.session.user.uname === await getRestUName(order.rows[0].fssai))
        ) {
            const setOrderStatement = getSetStatement(req.body);
            order = await pool.query(
                `UPDATE ORDERS ${setOrderStatement.query} WHERE OrderNo = $${setOrderStatement.nextIndex} RETURNING *`,
                setOrderStatement.params.concat([req.params.order_no])
            );
            res.send(order);
        } else {
            res.status(403).send("Unauthorized");
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
})

module.exports = router;