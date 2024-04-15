import { pool } from "../../db.js";

function getCargosFromCompany(company) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM cargos WHERE fk_empresa_id = ?`;
        pool.getConnection((err, con) => {
            if (err) {
                reject(err);
                return;
            }
            con.query(query, [company], (err, data) => {
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

export default getCargosFromCompany;
