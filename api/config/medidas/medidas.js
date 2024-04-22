import { pool } from "../../db.js";
function getMedidasFromTabela(grupo){
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM tabela_medidas WHERE (grupo_medida  IS NULL OR grupo_medida = ?)`;
        pool.getConnection((err, con) => {
            if (err) {
                reject(err);
                return;
            }
            con.query(query, [grupo], (err, data) => {
                con.release();
                if (err) {
                    reject(err);
                    return;
                }
                console.log(data)
                resolve(data);
            });
        });
    });
}

export default getMedidasFromTabela;