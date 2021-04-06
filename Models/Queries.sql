-- Fetching order history for customers
SELECT O.OrderNo AS Order_No, O.OrderTime As Order_Time, O.isPaid AS isCompleted, R.Rest_Name AS Restaurant, U.FirstName AS Delivery, SUM(OC.Quantity) AS Quantity, (SUM(OC.Quantity*FI.Price) + O.Del_Charge) AS Price
FROM ORDERS O, ORDER_CONTENTS OC, FOOD_ITEMS FI, RESTAURANTS R, USERS U
WHERE
    O.Cust_Uname = {uname} AND 
    O.FSSAI = R.FSSAI AND
    O.Del_Uname = U.Uname AND 
    OC.OrderNo = O.OrderNo AND 
    FI.ItemNo = OC.ItemNo AND 
    FI.FSSAI = O.FSSAI 
GROUP BY ( Order_No, Order_Time, isCompleted, Restaurant, Delivery);

-- Fetching order history for restaurants
SELECT O.OrderNo AS Order_No, O.OrderTime AS Order_Time, O.isPaid  AS isCompleted, U1.FirstName AS Customer, U2.FirstName AS Delivery, SUM(OC.Quantity) AS Quantity, (SUM(OC.Quantity*FI.Price) + O.Del_Charge) AS Price 
FROM ORDERS O, ORDER_CONTENTS OC, FOOD_ITEMS FI, RESTAURANTS R, USERS U1, USERS U2
WHERE
    R.Rest_Uname = {uname} AND 
    O.FSSAI = R.FSSAI AND 
    O.Cust_Uname = U1.Uname AND 
    O.Del_Uname = U2.Uname AND 
    OC.OrderNo = O.OrderNo AND 
    FI.ItemNo = OC.ItemNo AND 
    FI.FSSAI = O.FSSAI 
GROUP BY ( Order_No, Order_Time, isCompleted, Customer, Delivery);

-- Fetching order history for delivery person
SELECT O.OrderNo AS Order_No, O.OrderTime AS Order_Time, O.isPaid  AS isCompleted, U.FirstName AS Customer, R.Rest_Name AS Restaurant, SUM(OC.Quantity) AS Quantity, O.Del_Charge AS Price
FROM ORDERS O, ORDER_CONTENTS OC, FOOD_ITEMS FI, RESTAURANTS R, USERS U
WHERE
    O.Del_Uname = {uname} AND
    O.Cust_Uname = U.Uname AND 
    O.FSSAI = R.FSSAI AND 
    OC.OrderNo = O.OrderNo AND 
    FI.ItemNo = OC.ItemNo AND 
    FI.FSSAI = O.FSSAI 
GROUP BY ( Order_No, Order_Time, isCompleted, Customer, Restaurant);

--Fetch all details of particular order
SELECT * FROM ORDERS WHERE OrderNo = {order_no};
SELECT * FROM CUSTOMERS WHERE Cust_Uname = {cust_uname};
SELECT * FROM RESTAURANTS WHERE Rest_Uname = {rest_uname};
SELECT * FROM DELIVERY_PERSONS WHERE Del_Uname = {del_uname};
SELECT FI.ItemName, FI.Price, OC.Quantity FROM ORDER_CONTENTS OC, FOOD_ITEMS FI
WHERE OC.OrderNo = {order_no} AND OC.ItemNo = FI.ItemNo AND OC.FSSAI = FI.FSSAI;

--Fetch the cart
SELECT O.OrderNo AS Order_No, R.Rest_Name As Restaurant, FI.ItemName, FI.Price, OC.Quantity 
FROM ORDERS O, ORDER_CONTENTS OC, RESTAURANTS R, FOOD_ITEMS FI
WHERE
    O.Cust_Uname = {uname} AND 
    O.isPlaced = {false} AND 
    O.OrderNo = OC.OrderNo AND 
    OC.ItemNo = FI.ItemNo AND
    OC.FSSAI = FI.FSSAI AND 
    O.FSSAI = R.FSSAI;