import winston from 'winston';
import MySQLTransport from 'winston-mysql';
import mysql from 'mysql';

const mysqlTransport = new MySQLTransport({
  level: 'info',
  format: winston.format.json(),
  host: '50.116.112.129',
  port: 3306,
  user: 'asse3972_medworkld_joao',
  password: 'Jo@159a753s',
  database: 'asse3972_db_medwork_dev',
  table: 'logs',
  log: (info, callback) => {
    const connection = mysql.createConnection({
       host: '50.116.112.129',
       user: 'asse3972_medworkldn',
       password: 'mdk@#ldn!$',
       database: 'asse3972_db_medwork_dev',
    });
   
    connection.connect(err => {
       if (err) {
         callback(err);
         return;
       }
   
       // Supondo que info.message seja um objeto com os dados que você deseja inserir
       const dataToInsert = info.message;
   
       // Ajuste os nomes das chaves para corresponder aos nomes das colunas na tabela logs
       const adjustedData = {
         tabela_log: dataToInsert.tabela,
         tipo_log: dataToInsert.tipo,
         mudanca_log: dataToInsert.mudanca,
         who_log: dataToInsert.who,
         tenant_code_log: dataToInsert.tenantCode,
         data_log: dataToInsert.data,
         body_log: JSON.stringify(dataToInsert.body), 

       };
       console.log(adjustedData)
       connection.query(
         'INSERT INTO logs SET ?',
         adjustedData,
         (error, results) => {
           if (error) {
             callback(error);
             return;
           }
           callback(null, true);
         }
       );
    });
   }
   
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ mudanca, tabela, tenantCode, tipo, who, data, body }) => {
          
          return `${mudanca} ${tabela} ${tenantCode} ${tipo} ${who} ${data} ${body}`;
        })
      ),
    }),
    mysqlTransport,
  ],
});

export default function registrarLog(tabela, tipo, mudanca, who, tenantCode, data, body,) {
  logger.info({
    mudanca,
    tabela,
    tenantCode,
    tipo,
    who,
    data,
    body
  });
}
