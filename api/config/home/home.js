import { pool } from "../../db.js";

function getEmpresasHome(tenant_code,callback) {
    const query = `SELECT * FROM empresas WHERE fk_tenant_code = ?`;

    // Get a connection from the pool
    pool.getConnection((err, con) => {
        if (err) {
            // Handle connection error
            callback(err, null);
            return;
        }

        // Execute the query
        con.query(query, tenant_code, (err, data) => {
            // Release the connection back to the pool
            con.release();

            if (err) {
                // Handle query execution error
                callback(err, null);
                return;
            }

            // Return the data
            callback(null, data);
        });
    });
}

export default getEmpresasHome;
