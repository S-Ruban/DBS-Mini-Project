const { makeWorkerUtils, run } = require('graphile-worker');
const { getDistance: distance } = require('geolib');
const pool = require('./Models/dbConfig');

const assignDelivery = async (payload) => {
	const res = await pool.query(
		'SELECT Del_Uname, lat, long FROM DELIVERY_PERSONS WHERE isAvail = $1',
		[true]
	);
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
				distance(
					{ latitude: e.lat, longitude: e.long },
					payload.rest_loc
				) + distance(payload.rest_loc, payload.cust_loc);
			if (d < min) {
				min = e;
				dist = d;
			}
		});
		const delCharge = Math.round(Math.max(5, 0.003 * dist));
		await pool.query(
			'UPDATE ORDERS SET isAssigned = $1, Del_Uname = $2, Del_Charge = $3 WHERE OrderNo = $4',
			[true, min.del_uname, delCharge, payload.orderNo]
		);
	}
	throw new Error('No delivery person nearby!');
};

const newWorkerUtils = async () => {
	try {
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
	runner.events.on('job:failed', ({ job }) => {
		console.log(`Order ${job.payload.orderNo} failed!`);
	});
};

module.exports = { newWorkerUtils, newRunner };
