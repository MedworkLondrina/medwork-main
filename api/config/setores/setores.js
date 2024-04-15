import { pool } from "../../db.js";

function getSetoresFromCompany(company) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM setores WHERE fk_empresa_id = ?`;
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
                //console.log(data)
                resolve(data);
            });
        });
    });
}

export default getSetoresFromCompany;
