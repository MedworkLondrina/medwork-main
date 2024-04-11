import { pool } from "../../db.js";

function getNomeByEmail(email, callback) {
    const query = `SELECT id_usuario, nome_usuario, fk_tenant_code FROM usuarios WHERE email = ?`;
  
    pool.getConnection((err, con) => {
      if (err) {
        callback(err, null);
        return;
      }
  
      con.query(query, [email], (err, data) => {
        con.release();
  
        if (err) {
          callback(err, null);
          return;
        }
  
        callback(null, data);
      });
    });
  }
export default getNomeByEmail;