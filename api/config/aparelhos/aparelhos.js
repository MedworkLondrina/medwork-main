import { pool } from "../../db.js";

function getAparelhosFromTenant(tenant) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM aparelhos WHERE fk_tenant_code = ?`;
        pool.getConnection((err, con) => {
            if (err) {
                reject(err);
                return;
            }
            con.query(query, [tenant], (err, data) => {
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
export default getAparelhosFromTenant;