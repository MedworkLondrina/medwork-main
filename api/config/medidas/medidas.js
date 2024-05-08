import { pool } from "../../db.js";

function getMedidasFromTabela(tenantCode, grupo) {
	return new Promise((resolve, reject) => {
		// Primeiro, verifica o valor de 'global' para o tenant_code especificado
		const queryGlobalCheck = 'SELECT global FROM tenant WHERE tenant_code =?';
		pool.getConnection((err, con) => {
			if (err) {
				reject(err);
				return;
			}
			con.query(queryGlobalCheck, [tenantCode], (err, results) => {
				con.release();
				if (err) {
					reject(err);
					return;
				}
				// Verifica se results é um array e contém pelo menos um elemento
				if (Array.isArray(results) && results.length > 0) {
					const [global] = results;
					let query;
					let queryParams = [];
					if (global.global === 1) {
						// Se global é 1, busca medidas com tenant_code = ao tenantCode fornecido ou com tenant_code nulo
						if (grupo === 'all') {
							query = 'SELECT * FROM medidas WHERE tenant_code =? OR tenant_code IS NULL';
							queryParams = [tenantCode];
						} else {
							query = 'SELECT * FROM medidas WHERE tenant_code =? OR tenant_code IS NULL AND grupo_medida =?';
							queryParams = [tenantCode, grupo];
						}
					} else {
						// Se global é 0, busca apenas as medidas com tenant_code = ao tenantCode fornecido
						if (grupo === 'all') {
							query = 'SELECT * FROM medidas WHERE tenant_code =?';
						} else {
							query = 'SELECT * FROM medidas WHERE tenant_code =? AND grupo_medida =?';
							queryParams = [tenantCode, grupo];
						}
					}
					// Executa a consulta final com base na lógica acima
					con.query(query, queryParams, (err, data) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(data);
					});
				} else {
					// Trata o caso em que results está vazio ou não é um array
					reject(new Error('No results found or results is not an array'));
				}
			});
		});
	});
}

export default getMedidasFromTabela;
