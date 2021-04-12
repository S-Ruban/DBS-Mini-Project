const socketio = require('socket.io');
const pool = require('./Models/dbConfig');
const { getRestUname } = require('./Models/helpers');

const users = new Map();
let app;

const accept = async (details) => {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const order = await client.query(
			'UPDATE ORDERS SET isAssigned = $1, Del_Uname = $2, Del_Charge = $3 WHERE OrderNo = $4 RETURNING *',
			[true, details.delUname, details.delCharge, details.payload.orderNo]
		);
		await client.query('UPDATE DELIVERY_PERSONS SET isAvail = $1 WHERE Del_Uname = $2', [
			false,
			details.delUname
		]);
	} catch (err) {
		client.query('ROLLBACK');
		console.log(err.stack);
		res.status(500).send({ stack: err.stack, message: err.message });
	} finally {
		client.release();
	}
	return order.rows[0];
};

const reject = (details) => {
	details.payload.rejectedBy.push(details.delUname);
	app.get('workerUtils').addJob('assignDelivery', details.payload, { maxAttempts: 5 });
};

const connect = (server, appReceived) => {
	const io = socketio(server);
	app = appReceived;

	io.on('connection', (socket) => {
		console.log(`New Connection: ${socket.id}`);
		socket.on('login', (uname) => users.set(uname, socket.id));
		socket.on('delAccepted', async (details) => {
			const order = await accept(details);
			const rest_uname = await getRestUname(order.fssai);
			const res = await pool.query('SELECT * FROM DELIVERY_PERSONS WHERE Del_Uname = $1', [
				details.delUname
			]);
			const delDetails = { delivery: res.rows[0], delCharge: details.delCharge, order };
			if (users.get(order.cust_uname))
				io.to(users.get(order.cust_uname)).emit('assigned', delDetails);
			if (users.get(rest_uname)) io.to(users.get(rest_uname)).emit('assigned', delDetails);
		});
		socket.on('delRejected', reject);
	});

	return io;
};

const getSocketID = (uname) => users.get(uname);

module.exports = { connect, getSocketID };
