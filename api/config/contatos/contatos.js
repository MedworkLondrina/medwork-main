import { pool } from "../../db.js";


function contatosGetByEmpresa(empresa){
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM contatos WHERE fk_empresa_id = ?`;
        pool.getConnection((err, con) => {
            if (err) {
                reject(err);
                return;
            }
            con.query(query, [empresa], (err, data) => {
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

export default contatosGetByEmpresa;
