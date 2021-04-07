const pool = require("./dbConfig");

const getSetStatement = (patch, initialNum = 1) => {
	let query = `SET`;
	let params = [];
	let i = 0;
	for (let key in patch) {
		if (i) query += ",";
		query += ` ${key} = $${initialNum + i++}`;
		params.push(patch[key]);
	}
	return { query, params, nextIndex: initialNum + i };
};

const getRestUname = async (fssai) => {
	const result = await pool.query(
		"SELECT * FROM RESTAURANTS WHERE FSSAI = $1",
		[fssai]
	);
	if (result.rowCount) return result.rows[0].rest_uname;
	else return null;
};

const getFSSAI = async (rest_uname) => {
	const result = await pool.query(
		"SELECT * FROM RESTAURANTS WHERE Rest_Uname = $1",
		[rest_uname]
	);
	if (result.rowCount) return result.rows[0].fssai;
	else return null;
};

module.exports = { getSetStatement, getRestUname, getFSSAI };
