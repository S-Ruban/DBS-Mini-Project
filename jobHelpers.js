const { makeWorkerUtils, run } = require('graphile-worker');
const { getDistance: distance, getCenter } = require('geolib');
const pool = require('./Models/dbConfig');
const { getSocketID } = require('./socket');
const { getRestUname } = require('./Models/helpers');

let app;

const assignDelivery = async (payload) => {
	let res;
	if (payload.rejectedBy.length) {
		res = await pool.query(
			`
			SELECT Del_Uname, lat, long FROM DELIVERY_PERSONS WHERE isAvail = $1 AND 
			Del_Uname NOT IN (${payload.rejectedBy.join(',')})
			`,
			[true]
		);
	} else {
		res = await pool.query(
			'SELECT Del_Uname, lat, long FROM DELIVERY_PERSONS WHERE isAvail = $1',
			[true]
		);
	}
	const delPersons = res.rows;

	delPersons.filter(
		(e) =>
			distance({ latitude: e.lat, longitude: e.long }, payload.rest_loc) +
				distance(payload.rest_loc, payload.cust_loc) <=
			20000
	);

	if (delPersons.length) {
		let min = delPersons[0],
			dist = 20000;
		delPersons.forEach((e) => {
			const d =
				distance({ latitude: e.lat, longitude: e.long }, payload.rest_loc) +
				distance(payload.rest_loc, payload.cust_loc);
			if (d < min) {
				min = e;
				dist = d;
			}
		});
		const delCharge = Math.round(Math.max(5, 0.003 * dist));
		const del_loc = { latitude: min.lat, longitude: min.long };
		const center = getCenter(payload.cust_loc, payload.rest_loc, del_loc);
		if (getSocketID(min.del_uname)) {
			app.get('io').to(getSocketID(min.del_uname)).emit('deliveryQuery', {
				delUname: min.del_uname,
				del_loc,
				center,
				distance: dist,
				delCharge,
				payload
			});
		} else throw new Error('Delivery person not connected');
	}
	throw new Error('No delivery person nearby!');
};

const newWorkerUtils = async (appReceived) => {
	try {
		app = appReceived;
		const workerUtils = await makeWorkerUtils({
			pgPool: pool
		});
		await workerUtils.migrate();
		return workerUtils;
	} catch (err) {
		console.log(err);
		return null;
	}
};

const newRunner = async () => {
	const runner = await run({
		pgPool: pool,
		taskList: { assignDelivery }
	});
	runner.events.on('job:failed', async ({ job }) => {
		const order = await pool.query('SELECT * FROM ORDERS WHERE OrderNo = $1', [
			job.payload.orderNo
		]);
		const { cust_uname, fssai } = order.rows[0];
		const rest_uname = await getRestUname(fssai);
		if (getSocketID(cust_uname))
			io.to(getSocketID(cust_uname)).emit('delFailed', order.rows[0]);
		if (getSocketID(rest_uname))
			io.to(getSocketID(rest_uname)).emit('delFailed', order.rows[0]);
	});
};

module.exports = { newWorkerUtils, newRunner };
