import { pool } from "../../db.js";

function getMedidasFromTabela(tenantCode, grupo) {
    return new Promise((resolve, reject) => {
        const queryGlobalCheck = 'SELECT global FROM tenant WHERE tenant_code = ?';
        pool.getConnection((err, con) => {
            if (err) {
              reject(err);
              return;
            }
            con.query(queryGlobalCheck, [tenantCode], (err, results) => {
                if (err) {
                    con.release();
                    reject(err);
                    return;
                }

                if (Array.isArray(results) && results.length > 0) {
                    const global = results[0].global;
                    let query;
                    let queryParams = [];

                    if (global === 1) {
                        if (grupo === 'all') {
                            query = 'SELECT * FROM medidas WHERE tenant_code = ? OR tenant_code IS NULL';
                            queryParams.push(tenantCode);
                        } else {
                            query = 'SELECT * FROM medidas WHERE (tenant_code = ? OR tenant_code IS NULL) AND grupo_medida = ?';
                            queryParams.push(tenantCode, grupo);
                        }
                    } else {
                        if (grupo === 'all') {
                            query = 'SELECT * FROM medidas WHERE tenant_code = ?';
                            queryParams.push(tenantCode);
                        } else {
                            query = 'SELECT * FROM medidas WHERE tenant_code = ? AND grupo_medida = ?';
                            queryParams.push(tenantCode, grupo);
                        }
                    }

                    con.query(query, queryParams, (err, data) => {
                        con.release();
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(data);
                    });
                } else {
                    con.release();
                    reject(new Error('No results found for the specified tenantCode.'));
                }
            });
        });
    });
  });
}

export default getMedidasFromTabela;
