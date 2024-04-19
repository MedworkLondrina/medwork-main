import { pool } from "../../db.js";

function getMedidasFromTabela(grupo) {
	return new Promise((resolve, reject) => {
		let query;
		let queryParams = [];

		if (grupo === 'all') {
			query = 'SELECT * FROM medidas';
		} else {
			query = 'SELECT * FROM medidas WHERE grupo_medida = ?';
			queryParams = [grupo];
		}

		pool.getConnection((err, con) => {
			if (err) {
				reject(err);
				return;
			}
			con.query(query, queryParams, (err, data) => {
				con.release();
				if (err) {
					reject(err);
					return;
				}
				resolve(data);
			});
		});
	});
}

export default getMedidasFromTabela;