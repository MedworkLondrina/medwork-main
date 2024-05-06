import { pool } from "../../db.js";

function getProcessosFromTenant(tenantCode) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT global FROM tenant WHERE tenant_code = ?';
        pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
                return;
            }
            conn.query(query, [tenantCode], (err, results) => {
                conn.release();
                if (err) {
                    reject(err);
                    return;
                }
                // Verifica se results é um array e contém pelo menos um elemento
                if (Array.isArray(results) && results.length > 0) {
                    const [global] = results;
                    const queryName = global.global === 1? 'queryGlobal' : 'queryTenant';
                    const globals = {
                        queryGlobal: 'SELECT * FROM processos WHERE (tenant_code =? OR tenant_code IS NULL)',
                        queryTenant: 'SELECT * FROM processos WHERE (tenant_code =?)',
                    };
                    const query = globals[queryName];
                    conn.query(query, [tenantCode], (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                } else {
                    // Trata o caso em que results está vazio ou não é um array
                    reject(new Error('Deu ruim! não encontrei nada'));
                }
            });
        });
    });
}

export default getProcessosFromTenant;
