import express from "express";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import getNomeByEmail from "../config/login/login.js";
import getSetoresFromCompany from '../config/setores/setores.js';
import getCargosFromCompany from '../config/cargos/cargos.js';
import registrarLog from "../config/utils/logger.js";

const router = express.Router();
const SECRET = 'medworkldn';

// Tabela Tenant
// Get table
//Get table
router.get("/tenant", (req, res) => {
  const queryParams = req.query.tenent_code;

  const q = `SELECT * FROM tenant WHERE tenant_code = ?`;

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, [queryParams], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });

    con.release();
  })

});

//Tabela Empresa
//Get table
router.get("/empresas", (req, res) => {
  const queryParams = req.query.tenent_code;
  const username = req.query.nome_usuario;

  const q = `SELECT * FROM empresas WHERE fk_tenant_code = ?`;

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, [queryParams], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });

    con.release();
  })

});

//Add rows in table
router.post("/empresas", (req, res) => {
  const { empresa_data, contato_data } = req.body;
  console.log('teste')
  console.log(empresa_data)
  const nomeUsuario = req.query.nome_usuario;
  const tenant = empresa_data.fk_tenant_code;

  const qEmpresa = "INSERT INTO empresas SET ?";
  const qContato = "INSERT INTO contatos SET ?";
  const qUpdate = `UPDATE empresas SET fk_contato_id = ? WHERE id_empresa = ?`;

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.beginTransaction((err) => {
      if (err) {
        console.error("Erro ao iniciar transação", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      con.query(qEmpresa, empresa_data, (err, empresaResult) => {
        if (err) {
          console.error("Erro ao inserir empresa na tabela", err);
          con.rollback(() => {
            console.error("Transação revertida devido a erro", err);
            return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
          });
        }

        const id_empresa = empresaResult.insertId;
        contato_data.fk_empresa_id = id_empresa;
        const requisicao = [
          contato_data
        ]
        console.log(requisicao)

        con.query(qContato, contato_data, (err, contatoResult) => {
          if (err) {
            console.error("Erro ao inserir contato na tabela", err);
            con.rollback(() => {
              console.error("Transação revertida devido a erro", err);
              return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
            });
          }

          const id_contato = contatoResult.insertId;

          con.query(qUpdate, [id_contato, id_empresa], (err, result) => {
            if (err) {
              console.error("Erro ao atualizar empresa na tabela", err);
              con.rollback(() => {
                console.error("Transação revertida devido a erro", err);
                return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
              });
              return; // Retornar após o rollback
            }

          })
          con.commit((err) => {
            if (err) {
              console.error("Erro ao confirmar transação", err);
              con.rollback(() => {
                console.error("Transação revertida devido a erro", err);
                return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
              });
            }
            const formatBody = (obj) => {
              let formatted = '';
              for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                  formatted += `${key}: ${obj[key]}, `;
                }
              }
              return formatted.slice(0, -2); // Remove a última vírgula e espaço
            };
            const bodyString_empresa = formatBody(empresa_data)
            const bodyString_contato = formatBody(contato_data)
            registrarLog('empresas', 'create', `Cadastrou Empresa`, `${nomeUsuario}`, tenant, new Date(), bodyString_empresa);
            registrarLog('contatos', 'create', `Cadastrou Contato`, `${nomeUsuario}`, tenant, new Date(), bodyString_contato);

            return res.status(200).json(`Empresa e Contato cadastrados com sucesso!`);
          });
        });
      });
    });


    con.release();
  });
});

//Update rows in table
router.put("/empresas/:id_empresa", (req, res, next) => {
  const { empresa_data, contato_data } = req.body;
  const nomeUsuario = req.query.nome_usuario;
  const tenant = req.query.tenant_code;
  const idEmpresa = req.params.id_empresa;

  const {
    empresa_data: {
      nome_empresa,
      razao_social,
      cnpj_empresa,
      inscricao_estadual_empresa,
      inscricao_municipal_empresa,
      cnae_empresa,
      grau_risco_cnae,
      descricao_cnae,
      ativo,
      fk_tenant_code
    },
    contato_data: {
      nome_contato,
      telefone_contato,
      email_contato,
      email_secundario_contato,
    }
  } = req.body;

  const empresaValues = [
    nome_empresa,
    razao_social,
    cnpj_empresa,
    inscricao_estadual_empresa,
    inscricao_municipal_empresa,
    cnae_empresa,
    grau_risco_cnae,
    descricao_cnae,
    ativo,
    fk_tenant_code,
  ];

  const contatoValues = [
    nome_contato,
    telefone_contato,
    email_contato,
    email_secundario_contato,
  ];

  const qEmpresa = `
    UPDATE empresas
    SET nome_empresa =?,
    razao_social =?,
    cnpj_empresa =?,
    inscricao_estadual_empresa =?,
    inscricao_municipal_empresa =?,
    cnae_empresa =?,
    grau_risco_cnae =?,
    descricao_cnae =?,
    ativo =?,
    fk_tenant_code =?
    WHERE id_empresa=?
  `;

  const qContato = `
  UPDATE contatos
  SET 
  nome_contato = ?,
  telefone_contato = ?,
  email_contato = ?,
  email_secundario_contato = ?,
  ativo = 1
  WHERE id_contato =?
`;
  // Supondo que você tenha uma maneira de obter o fk_contato_id correto para a empresa
  const qObterFkContatoId = `
    SELECT fk_contato_id FROM empresas WHERE id_empresa =?
  `;

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.beginTransaction((err) => {
      if (err) return next(err);

      con.query(qEmpresa, [...empresaValues, idEmpresa], (err, result) => {
        if (err) return con.rollback(() => next(err));

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Empresa não encontrada' });
        }

        con.query(qObterFkContatoId, [idEmpresa], (err, result) => {
          if (err) return con.rollback(() => next(err));

          const fkContatoId = result[0].fk_contato_id;
          console.log(fkContatoId)

          if (!fkContatoId) {
            return res.status(404).json({ error: 'Contato não encontrado para a empresa' });
          }
          // Atualiza os dados do contato
          con.query(qContato, [...contatoValues, fkContatoId], (err) => {
            if (err) return con.rollback(() => next(err));

            con.commit((err) => {
              if (err) return con.rollback(() => next(err));

              const formatBody = (obj) => {
                let formatted = '';
                for (const key in obj) {
                  if (obj.hasOwnProperty(key)) {
                    formatted += `${key}: ${obj[key]}, `;
                  }
                }
                return formatted.slice(0, -2); // Remove a última vírgula e espaço
              };
              const bodyString_empresa = formatBody(empresa_data)
              const bodyString_contato = formatBody(contato_data)

              registrarLog('empresas', 'put', `Alterou Empresa`, `${nomeUsuario}`, tenant, new Date(), bodyString_empresa);
              registrarLog('contato', 'put', `Alterou Contato`, `${nomeUsuario}`, tenant, new Date(), bodyString_contato);

              res.status(200).json("Empresa e contato atualizados com sucesso!");
            });
          });
        });
      });

      con.release();
    });
  });
});


//Desactivate row in table
router.put("/empresas/activate/:id_empresa", (req, res) => {
  const id_empresa = req.params.id_empresa;
  const { ativo } = req.body;

  const q = 'UPDATE empresas SET ativo = ? WHERE id_empresa = ?';
  const values = [ativo, id_empresa];

  pool.getConnection((err, con) => {
    if (err) return res.status(500).json({ error: 'Erro ao obter conexão.' });

    con.query(q, values, (err) => {
      con.release();

      if (err) {
        console.error('Erro ao atualizar status da empresa:', err);
        return res.status(500).json({ error: 'Erro ao atualizar status da empresa.' });
      }

      res.status(200).json({ message: 'Status da empresa atualizado com sucesso.' });
    });
  });
});


//Tabela Unidade
//Get table
router.get("/unidades", (req, res) => {
  const queryParams = req.query.companyId;

  const q = `SELECT * FROM unidades WHERE fk_empresa_id=?`;

  pool.getConnection((err, con) => {
    if (err) {
      // Trate o erro diretamente aqui
      console.error("Erro ao obter conexão:", err);
      return res.status(500).json({ error: "Erro ao obter conexão com o banco de dados." });
    }

    con.query(q, [queryParams], (err, data) => {
      // Certifique-se de verificar também por erros nesta query
      if (err) {
        console.error("Erro ao executar query:", err);
        con.release(); // Certifique-se de liberar a conexão mesmo em caso de erro
        return res.status(500).json({ error: "Erro ao executar a query no banco de dados." });
      }

      res.status(200).json(data);
      con.release(); // Não se esqueça de liberar a conexão após o uso bem-sucedido
    });
  });
});

//Add rows in table
router.post("/unidades", (req, res) => {
  const { unidade_data, contato_data } = req.body;
  const nomeUsuario = req.query.nome_usuario;
  const tenant = req.query.tenant_code;
  const data = req.body;

  const insertContatoQuery = "INSERT INTO contatos SET ?";
  const insertUnidadeQuery = "INSERT INTO unidades SET ?";
  const updateUnidadeQuery = "UPDATE unidades SET fk_contato_id = ? WHERE id_unidade = ?";
  const selectContatoQuery = "SELECT id_contato FROM contatos WHERE email_contato = ?";

  pool.getConnection((err, con) => {
    if (err) {
      console.error("Erro ao obter conexão do pool", err);
      return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
    }
    con.beginTransaction((err) => {
      if (err) {
        console.error("Erro ao iniciar transação", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      con.query(insertUnidadeQuery, unidade_data, (err, unidadeResult) => {
        if (err) {
          console.error("Erro ao inserir unidade na tabela", err);
          con.rollback(() => {
            console.error("Transação revertida devido a erro", err);
            return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
          });
        }

        const id_unidade = unidadeResult.insertId;

        // Verifica se o contato já existe
        con.query(selectContatoQuery, [contato_data.email_contato], (err, contatoResult) => {
          if (err) {
            console.error("Erro ao selecionar contato na tabela", err);
            con.rollback(() => {
              console.error("Transação revertida devido a erro", err);
              return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
            });
          }

          let id_contato;

          // Se o contato não existir, insira-o e obtenha o ID
          if (contatoResult.length === 0) {
            con.query(insertContatoQuery, contato_data, (err, contatoInsertResult) => {
              if (err) {
                console.error("Erro ao inserir contato na tabela", err);
                con.rollback(() => {
                  console.error("Transação revertida devido a erro", err);
                  return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
                });
              } else {
                id_contato = contatoInsertResult.insertId;
                // Atualiza a unidade com o ID do novo contato
                con.query(updateUnidadeQuery, [id_contato, id_unidade], (err, result) => {
                  if (err) {
                    console.error("Erro ao atualizar unidade na tabela", err);
                    con.rollback(() => {
                      console.error("Transação revertida devido a erro", err);
                      return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
                    });
                    return; // Retornar após o rollback
                  }
                  con.commit((err) => {
                    if (err) {
                      console.error("Erro ao confirmar transação", err);
                      con.rollback(() => {
                        console.error("Transação revertida devido a erro", err);
                        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
                      });
                    }

                    const formatBody = (obj) => {
                      let formatted = '';
                      for (const key in obj) {
                        if (obj.hasOwnProperty(key)) {
                          formatted += `${key}: ${obj[key]}, `;
                        }
                      }
                      return formatted.slice(0, -2); // Remove a última vírgula e espaço
                    };
                    const bodyString_unidade = formatBody(data.unidade_data)
                    const bodyString_contato = formatBody(data.contato_data)

                    registrarLog('unidades', 'create', `Cadastrou Unidade`, `${nomeUsuario}`, tenant, new Date(), bodyString_unidade);
                    registrarLog('contatos', 'create', `Cadastrou Contato`, `${nomeUsuario}`, tenant, new Date(), bodyString_contato);

                    return res.status(200).json(`Unidade e Contato cadastrados com sucesso!`);
                  });
                });
              }
            });
          } else {
            id_contato = contatoResult[0].id_contato;
            // Atualiza a unidade com o ID do contato existente
            con.query(updateUnidadeQuery, [id_contato, id_unidade], (err, result) => {
              if (err) {
                console.error("Erro ao atualizar unidade na tabela", err);
                con.rollback(() => {
                  console.error("Transação revertida devido a erro", err);
                  return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
                });
                return; // Retornar após o rollback
              }
              con.commit((err) => {
                if (err) {
                  console.error("Erro ao confirmar transação", err);
                  con.rollback(() => {
                    console.error("Transação revertida devido a erro", err);
                    return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
                  });
                }

                const formatBody = (obj) => {
                  let formatted = '';
                  for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                      formatted += `${key}: ${obj[key]}, `;
                    }
                  }
                  return formatted.slice(0, -2); // Remove a última vírgula e espaço
                };
                const bodyString_unidade = formatBody(data.unidade_data)
                const bodyString_contato = formatBody(data.contato_data)

                registrarLog('unidades', 'create', `Cadastrou Unidade`, `${nomeUsuario}`, tenant, new Date(), bodyString_unidade);
                // Não é necessário registrar o contato existente, pois não foi criado um novo
                return res.status(200).json(`Unidade cadastrada com sucesso e associada ao Contato existente!`);
              });
            });
          }
        });
      });
    });
    con.release();
  });
});





router.put("/unidades/:id_unidade", (req, res, next) => {
  const id_unidade = req.params.id_unidade;
  const data = req.body;
  const nome = req.query.nome_usuario;
  const tenant = req.query.tenant_code;

  const {
    unidade_data: {
      nome_unidade,
      cnpj_unidade,
      cep_unidade,
      endereco_unidade,
      numero_unidade,
      complemento,
      bairro_unidade,
      cidade_unidade,
      uf_unidade,
      fk_empresa_id,
    },
    contato_data: {
      nome_contato,
      telefone_contato,
      email_contato,
      email_secundario_contato,
      ativo,
    }
  } = data;

  // Query para atualizar a unidade
  const qUnidade = `
      UPDATE unidades
      SET nome_unidade =?,
          cnpj_unidade =?,
          cep_unidade =?,
          endereco_unidade =?,
          numero_unidade =?,
          complemento =?,
          bairro_unidade =?,
          cidade_unidade =?,
          uf_unidade =?,
          fk_empresa_id =?
      WHERE id_unidade =?
  `;

  // Query para atualizar o contato
  const qContato = `
      UPDATE contatos
      SET nome_contato =?,
          telefone_contato =?,
          email_contato =?,
          email_secundario_contato =?,
          ativo = 1
      WHERE id_contato =?
  `;

  // Valores para a unidade
  const unidadeValues = [
    nome_unidade,
    cnpj_unidade,
    cep_unidade,
    endereco_unidade,
    numero_unidade,
    complemento,
    bairro_unidade,
    cidade_unidade,
    uf_unidade,
    fk_empresa_id,
    id_unidade,
  ];
  const contatoValues = [
    nome_contato,
    telefone_contato,
    email_contato,
    email_secundario_contato,
  ]

  pool.getConnection((err, con) => {
    if (err) return next(err);
    // Inicia a transação
    con.beginTransaction((err) => {
      if (err) return next(err);
      // Atualiza os dados da unidade
      con.query(qUnidade, unidadeValues, (err, resultUnidade) => {
        if (err) return con.rollback(() => next(err));
        if (resultUnidade.affectedRows === 0) {
          return res.status(404).json({ error: 'Unidade não encontrada' });
        }

        const qObterFkContatoId = `SELECT fk_contato_id FROM unidades WHERE id_unidade =?`;
        con.query(qObterFkContatoId, [id_unidade], (err, resultContatoId) => {
          if (err) return con.rollback(() => next(err));

          const fkContatoId = resultContatoId[0].fk_contato_id;
          console.log(`fkContatoId: ${fkContatoId}`);
          // Agora, atualize a tabela de contatos usando o fk_empresa_id obtido
          con.query(qContato, [...contatoValues, fkContatoId], (err, resultContato) => {
            if (err) return con.rollback(() => next(err));

            // Commit da transação se todas as consultas forem bem-sucedidas
            con.commit((err) => {
              if (err) return con.rollback(() => next(err));

              // Se a transação for bem-sucedida, registra o log e envia a resposta
              const formatBody = (obj) => {
                let formatted = '';
                for (const key in obj) {
                  if (obj.hasOwnProperty(key)) {
                    formatted += `${key}: ${obj[key]}, `;
                  }
                }
                return formatted.slice(0, -2); // Remove a última vírgula e espaço
              };

              const bodyString_unidade = formatBody(data.unidade_data)
              const bodyString_contato = formatBody(data.contato_data)

              registrarLog('unidades', 'put', `Alterou Unidade`, `${nome}`, tenant, new Date(), bodyString_unidade);
              registrarLog('contatos', 'put', `Alterou Contato`, `${nome}`, tenant, new Date(), bodyString_contato);
              res.status(200).json("Unidade atualizada com sucesso!");
            });
          });


        });
      })
    })
    con.release();
  });
});



//Desactivate row in table
router.put("/unidades/activate/:id_unidade", (req, res) => {
  const id_unidade = req.params.id_unidade;
  const { ativo } = req.body;

  const q = 'UPDATE unidades SET ativo = ? WHERE id_unidade = ?';
  const values = [ativo, id_unidade];

  pool.getConnection((err, con) => {
    if (err) return res.status(500).json({ error: 'Erro ao obter conexão.' });

    con.query(q, values, (err) => {
      con.release();

      if (err) {
        console.error('Erro ao atualizar status da unidade:', err);
        return res.status(500).json({ error: 'Erro ao atualizar status da unidade.' });
      }

      res.status(200).json({ message: 'Status da unidade atualizado com sucesso.' });
    });
  });
});


//Tabela Setores
//Get table
router.get("/setores", (req, res) => {
  const queryParams = req.query.companyId;

  getSetoresFromCompany(queryParams)
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(error => {
      return res.status(500).json(error);
    });
});

//Add rows in table
router.post("/setores", (req, res) => {
  const data = req.body;
  const nome = req.query.nome_usuario
  const tenant = req.query.tenant_code
  const q = "INSERT INTO setores SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao inserir setor na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      const formatBody = (obj) => {
        let formatted = '';
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            formatted += `${key}: ${obj[key]}, `;
          }
        }
        return formatted.slice(0, -2); // Remove a última vírgula e espaço
      };
      const bodyString = formatBody(data);

      registrarLog('setores', 'create', `Criou Setor`, `${nome}`, tenant, new Date(), bodyString);

      return res.status(200).json(`Setor cadastrada com sucesso!`);
    });

    con.release();
  })

});

//Update row in table
router.put("/setores/:id_setor", (req, res) => {
  const id_setor = req.params.id_setor; // Obtém o ID da empresa da URL
  const nome = req.query.nome_usuario
  const tenant = req.query.tenant_code
  const { nome_setor, ambiente_setor, observacao_setor, fk_unidade_id } = req.body;
  const data = req.body

  const q = `
    UPDATE setores
    SET nome_setor = ?,
    ambiente_setor = ?,
    observacao_setor = ?,
    fk_unidade_id = ?
    WHERE id_setor = ?
    `;

  const values = [
    nome_setor,
    ambiente_setor,
    observacao_setor,
    fk_unidade_id,
    id_setor,
  ];

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar setor na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      const formatBody = (obj) => {
        let formatted = '';
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            formatted += `${key}: ${obj[key]}, `;
          }
        }
        return formatted.slice(0, -2); // Remove a última vírgula e espaço
      };
      const bodyString = formatBody(data);

      registrarLog('setores', 'put', `Alterou Setor`, `${nome}`, tenant, new Date(), bodyString);

      return res.status(200).json("Setor atualizada com sucesso!");
    });

    con.release();
  })

});

//Desactivate row in table
router.put("/setores/activate/:id_setor", (req, res) => {
  const id_setor = req.params.id_setor;
  const { ativo } = req.body;
  const data = req.body
  const q = 'UPDATE setores SET ativo = ? WHERE id_setor = ?';
  const values = [ativo, id_setor];

  pool.getConnection((err, con) => {
    if (err) return res.status(500).json({ error: 'Erro ao obter conexão.' });

    con.query(q, values, (err) => {
      con.release();

      if (err) {
        console.error('Erro ao atualizar status do setor:', err);
        return res.status(500).json({ error: 'Erro ao atualizar status do setor.' });
      }

      res.status(200).json({ message: 'Status do setor atualizado com sucesso.' });
    });
  });
});



//Tabela Cargo
//Get table
router.get("/cargos", (req, res) => {
  const queryParams = req.query.companyId;


  getCargosFromCompany(queryParams)
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(error => {
      return res.status(500).json(error);
    });

});

//Add rows in table
router.post("/cargos", (req, res) => {
  const data = req.body;
  const nome = req.query.nome_usuario
  const tenant = req.query.tenant_code
  const q = "INSERT INTO cargos SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao inserir Cargo na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      const formatBody = (obj) => {
        let formatted = '';
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            formatted += `${key}: ${obj[key]}, `;
          }
        }
        return formatted.slice(0, -2); // Remove a última vírgula e espaço
      };
      const bodyString = formatBody(data);

      registrarLog('cargos', 'create', `Cadastrou Cargo`, `${nome}`, tenant, new Date(), bodyString);

      return res.status(200).json(`Cargo cadastrada com sucesso!`);
    });

    con.release();
  })

});

//Update row in table
router.put("/cargos/:id_cargo", (req, res) => {
  const id_cargo = req.params.id_cargo; // Obtém o ID da empresa da URL
  const nome = req.query.nome_usuario
  const tenant = req.query.tenant_code
  const data = req.body
  const { nome_cargo, descricao, func_masc, func_fem, func_menor, fk_setor_id } = req.body;

  const q = `
    UPDATE cargos
    SET nome_cargo = ?,
    descricao = ?,
    func_masc = ?,
    func_fem = ?,
    func_menor = ?,
    fk_setor_id = ?
    WHERE id_cargo = ?
    `;

  const values = [
    nome_cargo,
    descricao,
    func_masc,
    func_fem,
    func_menor,
    fk_setor_id, // Este valor deve ser passado para a cláusula SET
    id_cargo, // Este valor deve ser passado para a cláusula WHERE
  ];

  pool.getConnection((err, con) => {
    if (err) {
      console.error("Erro ao obter conexão com o banco de dados", err);
      return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
    }

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar cargo na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      const formatBody = (obj) => {
        let formatted = '';
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            formatted += `${key}: ${obj[key]}, `;
          }
        }
        return formatted.slice(0, -2); // Remove a última vírgula e espaço
      };
      const bodyString = formatBody(data)
      registrarLog('cargos', 'put', `Alterou Cargo`, `${nome}`, tenant, new Date(), bodyString);

      return res.status(200).json("Cargo atualizada com sucesso!");
    });

    con.release();
  });


});

router.put("/cargos/activate/:id_cargo", (req, res) => {
  const id_cargo = req.params.id_cargo;
  const { ativo } = req.body;

  const q = 'UPDATE cargos SET ativo = ? WHERE id_cargo = ?';
  const values = [ativo, id_cargo];

  pool.getConnection((err, con) => {
    if (err) return res.status(500).json({ error: 'Erro ao obter conexão.' });

    con.query(q, values, (err) => {
      con.release();

      if (err) {
        console.error('Erro ao atualizar status do cargo:', err);
        return res.status(500).json({ error: 'Erro ao atualizar status do cargo.' });
      }

      res.status(200).json({ message: 'Status do cargo atualizado com sucesso.' });
    });
  });
});



//Tabela Contato
//Get table
router.get("/contatos", (req, res) => {
  const queryParams = req.query.companyId;
  contatosGetByEmpresa(queryParams)
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(error => {
      return res.status(500).json(error);
    });
});

//Add rows in table
router.post("/contatos", (req, res) => {
  const nome = req.query.nome_usuario
  const tenant = req.query.tenant_code
  const data = req.body;

  const q = "INSERT INTO contatos SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao inserir contato na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      registrarLog('contatos', 'create', `Cadastrou Cargo`, `${nome}`, tenant, new Date());

      return res.status(200).json(`Contato cadastrado com sucesso!`);

    });

    con.release();
  })

});

//Update row int table
router.put("/contatos/:id_contato", (req, res) => {
  const id_contato = req.params.id_contato; // Obtém o ID da empresa da URL
  const { nome_contato, telefone_contato, email_contato, email_secundario_contato } = req.body;

  const q = `
    UPDATE contatos
    SET nome_contato = ?,
    telefone_contato = ?,
    email_contato = ?,
    email_secundario_contato = ?
    WHERE id_contato = ?
    `;

  const values = [
    nome_contato,
    telefone_contato,
    email_contato,
    email_secundario_contato,
    id_contato
  ];

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar contato na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json("Contato atualizado com sucesso!");
    });

    con.release();
  })

});

router.put("/contatos/activate/:id_contato", (req, res) => {
  const id_contato = req.params.id_contato;
  const { ativo } = req.body;

  const q = 'UPDATE contatos SET ativo = ? WHERE id_contato = ?';
  const values = [ativo, id_contato];

  pool.getConnection((err, con) => {
    if (err) return res.status(500).json({ error: 'Erro ao obter conexão.' });

    con.query(q, values, (err) => {
      con.release();

      if (err) {
        console.error('Erro ao atualizar status do contato:', err);
        return res.status(500).json({ error: 'Erro ao atualizar status do contato.' });
      }

      res.status(200).json({ message: 'Status do contato atualizado com sucesso.' });
    });
  });
});




//Tabela Processos
//Get table
router.get("/processos", async (req, res) => {
  const tenant = req.query.tenant_code;
  try {
    const data = await getProcessosFromTenant(tenant);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching risks' });
  }

});

router.post("/processos", (req, res) => {
  const data = req.body;
  console.log("Data recebida:", data); // Verifique a estrutura de data aqui
  const nome = req.query.nome_usuario;
  const tenant = req.query.tenant_code;
  const q = "INSERT INTO processos SET?";


  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao inserir processo na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      const id = result.insertId;
      const formatBody = (obj) => {
        let formatted = '';
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            formatted += `${key}: ${obj[key]}, `;
          }
        }
        return formatted.slice(0, -2); // Remove a última vírgula e espaço
      };


      const bodyString = formatBody(data);

      // Certifique-se de que registrarLog seja chamado com todos os argumentos necessários
      // registrarLog('processos', 'create', `Cadastrou Processo`, nome, tenant, new Date(), bodyString);

      return res.status(200).json({ message: `Processo cadastrado com sucesso`, id });
    });

    con.release();
  })
});

//Update row int table
router.put("/processos/:id_processo", (req, res) => {
  const id_processo = req.params.id_processo;
  const nome = req.query.nome_usuario
  const tenant = req.query.tenant_code
  const { nome_processo } = req.body;
  const data = req.body

  const q = `
    UPDATE processos
    SET nome_processo = ?
    WHERE id_processo = ?
    `;

  const values = [
    nome_processo,
    id_processo
  ];

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar processo na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      registrarLog('processos', 'put', `Alterou nome do processo`, `${nome}`, tenant, new Date(), data);

      return res.status(200).json("Processo atualizado com sucesso!");
    });

    con.release();
  })

});



//Tabela Processos
//Get table
router.get("/processo_cnae", (req, res) => {
  const q = `SELECT * FROM processo_cnae`;
  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });

    con.release();
  })

});

//Add rows in table
router.post("/processo_cnae", (req, res) => {
  const data = req.body;
  const nome = req.query.nome_usuario
  const tenant = req.query.tenant_code
  const q = "INSERT INTO processo_cnae SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao vincular cnae no processo", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      registrarLog('processo_cnae', 'create', `vinculou CNAE ao processo`, `${nome}`, tenant, new Date(), data);

      return res.status(200).json(`Vinculo cadastrado com sucesso!`);
    });

    con.release();
  })

});

//Update row int table
router.put("/processo_cnae/:id_processo_cnae", (req, res) => {
  const id_processo_cnae = req.params.id_processo_cnae;
  const { fk_processo_id, fk_cnae_id } = req.body;

  const q = `
    UPDATE processos
    SET fk_processo_id = ?,
    fk_cnae_id = ?
    WHERE id_processo_cnae = ?
    `;

  const values = [
    fk_processo_id,
    fk_cnae_id,
    id_processo_cnae
  ];

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar vinculo de cnae no processo", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      registrarLog('processos', 'put', `Alterou cnae do processo`, `${nome}`, tenant, new Date(), values);

      return res.status(200).json("Vinculo atualizado com sucesso!");
    });

    con.release();
  })

});



//Tabela Processos
//Get table
router.get("/cnae", (req, res) => {
  const q = `SELECT * FROM cnae`;
  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });

    con.release();
  })

});


//Tabela Riscos
//Get table
router.get("/riscos", async (req, res) => {
  const tenant = req.query.tenant_code;
  try {
    const data = await getRiscosFromPermissions(tenant);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching risks' });
  }
});

//Add rows in table
router.post("/riscos", (req, res) => {
  const data = req.body;
  const nome = req.query.nome_usuario
  const tenant = req.query.tenant_code
  const q = "INSERT INTO riscos SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao inserir risco na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      const id_risco = result.insertId;
      const formatBody = (obj) => {
        let formatted = '';
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            formatted += `${key}: ${obj[key]}, `;
          }
        }
        return formatted.slice(0, -2); // Remove a última vírgula e espaço
      };
      const bodyString = formatBody(data)
      registrarLog('riscos', 'create', `Cadastrou Risco`, `${nome}`, tenant, new Date(), bodyString);

      return res.status(200).json({ message: `Risco cadastrado com sucesso!`, id_risco });
    });

    con.release();
  })

});

router.put("/riscos/:id_risco", (req, res) => {
  const id_risco = req.params.id_risco;
  const tenant = req.query.tenant_code
  const nome = req.query.nome_usuario
  const {
    nome_risco,
    grupo_risco,
    codigo_esocial_risco,
    meio_propagacao_risco,
    unidade_medida_risco,
    classificacao_risco,
    nivel_acao_risco,
    limite_tolerancia_risco,
    danos_saude_risco,
    metodologia_risco,
    severidade_risco,
    pgr_risco,
    ltcat_risco,
    lip_risco,
    tenant_code
  } = req.body;
  const data = req.body
  const q = `
    UPDATE riscos
    SET nome_risco = ?,
    grupo_risco = ?,
    codigo_esocial_risco = ?,
    meio_propagacao_risco = ?,
    unidade_medida_risco = ?,
    classificacao_risco = ?,
    nivel_acao_risco = ?,
    limite_tolerancia_risco = ?,
    danos_saude_risco = ?,
    metodologia_risco = ?,
    severidade_risco = ?,
    pgr_risco = ?,
    ltcat_risco = ?,
    lip_risco = ?,
    tenant_code =?
    WHERE id_risco = ?
    `;

  const values = [
    nome_risco,
    grupo_risco,
    codigo_esocial_risco,
    meio_propagacao_risco,
    unidade_medida_risco,
    classificacao_risco,
    nivel_acao_risco,
    limite_tolerancia_risco,
    danos_saude_risco,
    metodologia_risco,
    severidade_risco,
    pgr_risco,
    ltcat_risco,
    lip_risco,
    tenant,
    id_risco
  ];

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar risco na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      return res.status(200).json({ message: `Risco cadastrado com sucesso!` });
    });
    const formatBody = (obj) => {
      let formatted = '';
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          formatted += `${key}: ${obj[key]}, `;
        }
      }
      return formatted.slice(0, -2);
    };
    const bodyString = formatBody(data)
    registrarLog('riscos', 'put', `Alterou Riscos`, `${nome}`, tenant, new Date(), bodyString);

    con.release();
  })

});

// Tabela de Conclusões
// Get Table
router.get("/conclusoes", (req, res) => {
  const riscoid = req.query.id_risco
  const q = `SELECT * FROM conclusoes where fk_risco_id =?`;

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, riscoid, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });

    con.release();
  })

});

// Add rows in table
router.post("/conclusoes", (req, res) => {
  const data = req.body;

  const q = "INSERT INTO conclusoes SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao inserir conclusão na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json(`Conclusão cadastrado com sucesso!`);
    });

    con.release();
  })

});

//Update row int table
router.put("/conclusoes/:id_conclusao", (req, res) => {
  const id_conclusao = req.params.id_conclusao;
  const {
    fk_risco_id,
    nome_conclusao,
    tipo,
    conclusao,
    laudo
  } = req.body;

  const q = `
    UPDATE conclusoes
    SET fk_risco_id = ?,
    nome_conclusao = ?,
    tipo = ?,
    conclusao = ?,
    laudo = ?
    WHERE id_conclusao = ?
    `;

  const values = [
    fk_risco_id,
    nome_conclusao,
    tipo,
    conclusao,
    laudo,
    id_conclusao
  ];

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar conclusão na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json("Conclusão atualizado com sucesso!");
    });

    con.release();
  })

});

router.put("/medidas/:id_medida", (req, res) => {
  const id_medida = req.params.id_medida;
  const nome = req.query.nome_usuario
  const tenant = req.query.tenant_code
  const {
    descricao_medida,
    grupo_medida,
  } = req.body;
  const data = req.body

  const q = `
    UPDATE medidas
    SET descricao_medida = ?,
    grupo_medida = ?
    WHERE id_medida = ?
    `;

  const values = [
    descricao_medida,
    grupo_medida,
    id_medida
  ];

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar medida na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      const formatBody = (obj) => {
        let formatted = '';
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            formatted += `${key}: ${obj[key]}, `;
          }
        }
        return formatted.slice(0, -2);
      };
      const bodyString = formatBody(data)
      registrarLog('medidas', 'put', `Alterou Medida`, `${nome}`, tenant, new Date(), bodyString);
      return res.status(200).json("Medida atualizado com sucesso!");
    });

    con.release();
  })

});

//Medidas de Proteção
//Tabela EPI's
//Get table
router.get("/medidas", async (req, res) => {
  const grupo = req.query.grupo;
  const tenant = req.query.tenant_code;
  try {
    const data = await getMedidasFromTabela(tenant, grupo);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching risks' });
  }
});

//Add rows in table
router.post("/medidas", (req, res) => {
  const data = req.body;
  const nome = req.query.nome_usuario
  const tenant = req.query.tenant_code
  const q = "INSERT INTO medidas SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao inserir Medida na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      const formatBody = (obj) => {
        let formatted = '';
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            formatted += `${key}: ${obj[key]}, `;
          }
        }
        return formatted.slice(0, -2);
      };
      const bodyString = formatBody(data)
      registrarLog('medidas', 'put', `Alterou Medidas`, `${nome}`, tenant, new Date(), bodyString);

      return res.status(200).json(`Medida cadastrado com sucesso!`);
    });

    con.release();
  })

});

router.put("/medidas/:id_medida", (req, res) => {
  const id_medida = req.params.id_medida;
  const nome = req.query.nome_usuario
  const tenant = req.query.tenant_code
  const {
    descricao_medida,
    grupo_medida,
  } = req.body;
  const data = req.body

  const q = `
    UPDATE medidas
    SET descricao_medida = ?,
    grupo_medida = ?
    WHERE id_medida = ?
    `;

  const values = [
    descricao_medida,
    grupo_medida,
    id_medida
  ];

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar medida na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      const formatBody = (obj) => {
        let formatted = '';
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            formatted += `${key}: ${obj[key]}, `;
          }
        }
        return formatted.slice(0, -2);
      };
      const bodyString = formatBody(data)
      registrarLog('medidas', 'put', `Alterou Medida`, `${nome}`, tenant, new Date(), bodyString);
      return res.status(200).json("Medida atualizado com sucesso!");
    });

    con.release();
  })

});


//Tabela EPI's
//Get table
router.get("/medidas_epi", (req, res) => {
  const queryParams = "MI";

  getMedidasFromTabela(queryParams)
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(error => {
      return res.status(500).json(error);
    });


});

//Add rows in table
router.post("/medidas_epi", (req, res) => {
  const data = req.body;

  const q = "INSERT INTO medidas_epi SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao inserir Medida na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json(`Medida cadastrado com sucesso!`);
    });

    con.release();
  })

});

router.put("/medidas_epi/:id_medida", (req, res) => {
  const id_medida = req.params.id_medida;
  const {
    nome_medida,
    certificado_medida,
    fator_reducao_medida,
    vencimento_certificado_medida,
    fabricante_medida,
  } = req.body;

  const q = `
    UPDATE medidas_epi
    SET nome_medida = ?,
    certificado_medida = ?,
    fator_reducao_medida = ?,
    vencimento_certificado_medida = ?,
    fabricante_medida = ?
    WHERE id_medida = ?
    `;

  const values = [
    nome_medida,
    certificado_medida,
    fator_reducao_medida,
    vencimento_certificado_medida,
    fabricante_medida,
    id_medida
  ];

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar medida na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json("Medida atualizado com sucesso!");
    });

    con.release();
  })

});


//Medidas Adminitrativas
//Get Table
router.get("/medidas_adm", (req, res) => {
  const q = `SELECT * FROM medidas_adm`;

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });

    con.release();
  })

});

//Add rows in table
router.post("/medidas_adm", (req, res) => {
  const data = req.body;
  const nome = req.query.nome_usuario
  const tenant = req.query.tenant_code
  const q = "INSERT INTO medidas_adm SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao inserir Medida na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      registrarLog('medidas', 'create', `Cadastrou Medida`, `${nome}`, tenant, new Date());

      return res.status(200).json(`Medida cadastrado com sucesso!`);
    });

    con.release();
  })

});

router.put("/medidas_adm/:id_medida_adm", (req, res) => {
  const nome = req.query.nome_usuario
  const tenant = req.query.tenant_code
  const id_medida_adm = req.params.id_medida_adm;
  const {
    descricao_medida_adm,
  } = req.body;

  const q = `UPDATE medidas_adm SET descricao_medida_adm = ? WHERE id_medida_adm = ?`;

  const values = [
    descricao_medida_adm,
    id_medida_adm,
  ];

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar medida na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      registrarLog('medidas', 'put', `Alterou Medida`, `${nome}`, tenant, new Date());

      return res.status(200).json("Medida atualizado com sucesso!");
    });

    con.release();
  })

});


//Medidas EPC's
//Get Table
router.get("/medidas_epc", (req, res) => {
  const q = `SELECT * FROM medidas_epc`;

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });

    con.release();
  })

});

//Add rows in table
router.post("/medidas_epc", (req, res) => {
  const data = req.body;

  const q = "INSERT INTO medidas_epc SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao inserir Medida na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json(`Medida cadastrado com sucesso!`);
    });

    con.release();
  })

});

router.put("/medidas_epc/:id_medida", (req, res) => {
  const id_medida = req.params.id_medida;
  const {
    descricao_medida
  } = req.body;

  const q = `UPDATE medidas_epc SET descricao_medida = ? WHERE id_medida = ?`;

  const values = [
    descricao_medida,
    id_medida
  ];

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar medida na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json("Medida atualizado com sucesso!");
    });

    con.release();
  })

});




//Gestão

//Tabela Usuarios
//Get table
router.get("/usuarios", (req, res) => {
  const tenant = req.query.tenant_code;
  const q = `SELECT * FROM usuarios WHERE fk_tenant_code = ?`;

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, tenant, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });

    con.release();
  })
});

//Add rows in table
router.post("/usuarios", (req, res) => {
  const data = req.body;
  const nome = req.query.nome_usuario
  const tenant = req.query.tenant_code

  const q = "INSERT INTO usuarios SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao inserir usuário na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      const formatBody = (obj) => {
        let formatted = '';
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            formatted += `${key}: ${obj[key]}, `;
          }
        }
        return formatted.slice(0, -2); // Remove a última vírgula e espaço
      };
      const bodyString = formatBody(data)
      registrarLog('usuarios', 'create', `Cadastrou Usuario`, `${nome}`, tenant, new Date(), bodyString);

      return res.status(200).json(`Usuário cadastrado com sucesso!`);
    });

    con.release();
  })
});

//Update row int table
router.put("/usuarios/:id_usuario", (req, res) => {
  const id_usuario = req.params.id_usuario;
  const tenant = req.query.tenant_code;
  const nome = req.query.nome_usuario

  const { nome_usuario, cpf_usuario, email, tipo, fk_tenant_code } = req.body;
  const data = req.body

  const q = `
    UPDATE usuarios
    SET nome_usuario = ?,
    cpf_usuario = ?,
    email = ?,
    tipo = ?,
    fk_tenant_code = ?
    WHERE id_usuario = ?
  `;

  // Verifica se tenant está definido para atribuir o valor de fk_tenant_code
  const values = [
    nome_usuario,
    cpf_usuario,
    email,
    tipo,
    tenant ? tenant : fk_tenant_code, // atribui tenant a fk_tenant_code se tenant estiver definido
    id_usuario
  ];

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar usuário na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      const formatBody = (obj) => {
        let formatted = '';
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            formatted += `${key}: ${obj[key]}, `;
          }
        }
        return formatted.slice(0, -2); // Remove a última vírgula e espaço
      };
      const bodyString = formatBody(data)
      registrarLog('usuarios', 'put', `Alterou Usuario`, `${nome}`, tenant, new Date(), bodyString);

      return res.status(200).json("Usuário atualizado com sucesso!");
    });

    con.release();
  });
});


router.put("/usuarios/activate/:id_usuario", (req, res) => {
  const id_usuario = req.params.id_usuario;
  const { ativo } = req.body;

  const q = 'UPDATE usuarios SET ativo = ? WHERE id_usuario = ?';
  const values = [ativo, id_usuario];

  pool.getConnection((err, con) => {
    if (err) return res.status(500).json({ error: 'Erro ao obter conexão.' });

    con.query(q, values, (err) => {
      con.release();

      if (err) {
        console.error('Erro ao atualizar status do usuario:', err);
        return res.status(500).json({ error: 'Erro ao atualizar status do usuario.' });
      }

      res.status(200).json({ message: 'Status da unidade atualizado com sucesso.' });
    });
  });
});

//Tabela Aparelhos
//Get table
router.get("/aparelhos", (req, res) => {
  const queryParams = req.query.tenent_code;

  getAparelhosFromTenant(queryParams)
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(error => {
      return res.status(500).json(error);
    });
});

//Add rows in table
router.post("/aparelhos", (req, res) => {
  const data = req.body;
  const tenant = req.query.tenant_code;
  const nome = req.query.nome_usuario
  const q = "INSERT INTO aparelhos SET ?"

  pool.getConnection((err, con) => {

    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao inserir aparelho na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      const formatBody = (obj) => {
        let formatted = '';
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            formatted += `${key}: ${obj[key]}, `;
          }
        }
        return formatted.slice(0, -2); // Remove a última vírgula e espaço
      };
      const bodyString = formatBody(data)
      registrarLog('aparelhos', 'create', `Criou Aparelho`, `${nome}`, tenant, new Date(), bodyString);

      return res.status(200).json(`Aparelho cadastrado com sucesso!`);
    })
    con.release();
  })

});

//Update row int table
router.put("/aparelhos/:id_aparelho", (req, res) => {
  const id_aparelho = req.params.id_aparelho; // Obtém o ID da empresa da URL
  const { nome_aparelho, marca_aparelho, modelo_aparelho, data_calibracao_aparelho } = req.body;
  const tenant = req.query.tenant_code;
  const nome = req.query.nome_usuario
  const data = req.body;
  const q = `
    UPDATE aparelhos
    SET nome_aparelho = ?,
    marca_aparelho = ?,
    modelo_aparelho = ?,
    data_calibracao_aparelho = ?
    WHERE id_aparelho = ?
    `;

  const values = [
    nome_aparelho,
    marca_aparelho,
    modelo_aparelho,
    data_calibracao_aparelho,
    id_aparelho
  ];

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar aparelho na tabela", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      const formatBody = (obj) => {
        let formatted = '';
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            formatted += `${key}: ${obj[key]}, `;
          }
        }
        return formatted.slice(0, -2); // Remove a última vírgula e espaço
      };
      const bodyString = formatBody(data)
      registrarLog('aparelhos', 'put', `Alterou Aparelho`, `${nome}`, tenant, new Date(), bo);

      return res.status(200).json("Aparelho atualizado com sucesso!");
    });
    con.release();

  })

});

router.put("/aparelhos/activate/:id_aparelho", (req, res) => {
  const id_aparelho = req.params.id_aparelho;
  const { ativo } = req.body;

  const q = 'UPDATE aparelhos SET ativo = ? WHERE id_aparelho = ?';
  const values = [ativo, id_aparelho];

  pool.getConnection((err, con) => {
    if (err) return res.status(500).json({ error: 'Erro ao obter conexão.' });

    con.query(q, values, (err) => {
      con.release();

      if (err) {
        console.error('Erro ao atualizar status do aparelho:', err);
        return res.status(500).json({ error: 'Erro ao atualizar status do aparelho.' });
      }

      res.status(200).json({ message: 'Status da unidade atualizado com sucesso.' });
    });
    con.release();

  });
});
//Tabela de Versões do PDF
//Get Table
router.get("/laudo_version", (req, res) => {
  const q = `SELECT * FROM laudo_version`;

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
    con.release();

  })

});

//Add rows in table
router.post("/laudo_version", (req, res) => {
  const data = req.body;

  const q = "INSERT INTO laudo_version SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao criar versão do pdf", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json(`Versão criada com sucesso!`);
    });

    con.release();
  })

});




// Verifica Usuário para Logar
import admin from 'firebase-admin'
import contatosGetByEmpresa from "../config/contatos/contatos.js";
import getElaboradoresfromTenant from "../config/elaboradores/elaboradores.js";
import getAparelhosFromTenant from "../config/aparelhos/aparelhos.js";
import getmedidasfromtabela from "../config/medidas/medidas.js";
import getMedidasFromTabela from "../config/medidas/medidas.js";
import getRiscosFromPermissions from "../config/riscos/riscos.js";
import getProcessosFromTenant from "../config/processos/processos.js";
import multer from "multer";

const serviceAccount = {
  "type": "service_account",
  "project_id": "medwork-ldn",
  "private_key_id": "7f0d638a29abc5c96a9c5937c26758e4a064a15b",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDeeNLosHwLMkbd\nldZmvz8JimqI9tT5MOQEQZ7rI5qtk3/lGsM1WLPmi02lnDg9J7ftnC0yJgATGsRK\nFXy4GNiUHuYNKGNch0IPgie8MuNAQ3kHZiGfEw2Hy/2BD1mMThUtZfpzY8SzzIu+\n2qZ4D12Z/HNS6syFXFaEYdBRiqvCIsx7JFA+oxFTVrlrRqgmRhAXhTS3Q36bNWvm\nfmZvrLnD3hohrfnGCBGhBjI1AKWyxdaWGrxW9twPBD/eP7rVxl8CffBYDdWJpkCF\nci9HdoN3E4NmQchDYmKdR7mhQtRagTlpgc8BMivQkey519p/Q1cAqNa5nfBUBK+z\n/75nfuHRAgMBAAECggEAAYoZf4W1Hgi3h9IBHU3mfETqbs8ycxT9BvCDToI9EEVs\nhaPVRPm7qPU+0M4Pb5DmS20gvO+ZYYh2YkLazZVSblf2ZJHqehnvgZb3emxpuSie\nXkg9JFIn7lAhjXKTPo7Nw7YocQL4OfxI3UW7ECqfDbE7BRBd4PBeIuVgYSgR/zJm\nJQYtIcozyOTyoGJaabEMxEKHu0Vpc7b+N0uPDlz2LuCdwPoi1J8hGm/Feuw204ep\njChXx1DnypbFhE3WpGinPAurE8N0Mm/6HzgYM27nrmgM4my6v6R8Pq7kcub7HMkW\n4jy7iPh4NZ2qoKqU77nOB7C/uYxlXy7y5xYuklOXpwKBgQD0+kuq8MXUGHARu0jr\nCjXzCahamnf4ypfwpL7duZKd/zeUqLFad/+NOGHJHqfFxZa4f+ZdlEK+q3qDZRUm\num/Sg9oOVeR/JJu0tEvlWm0T9X0miMnFcLc8+NzUZe86dztH+5vOx3K96at5bN7D\nNFHjqwDKHlyP33y0M2opOUV3NwKBgQDoe01oo8LyqWlTG4ohkKcj736V65pJD041\nYOw2nvKRRlDtAWAVI7fzA2KxhAhLCxvhgT0n6h1VRv7PV2DM+0bxtbvOAdyWhtAW\nSmT+RHlsggVnmsstO4h+dKPV0u8cs3WMMx/9khbTLmEXYb3CugNeu6xUscRiqxtE\nlbSKc0hjNwKBgGMG+qdzBMUjy8mfJ267hetksAVQA8cyPhEsx2rhpP7xOAqD1o13\njHoNnJmsJq2vnamfKgQR9pkUwEV1CwPIwYMbgX3iAqfSqI53g2aHEyjKR3jYOpfx\nZGDlSH8jZX0AzZnff7Aqt5tFZeeDtti5wZCCg6MwesI92S8OyY84c3gpAoGAIsyi\nL7GjstMtEuWibZfLjROCbUqRE7KY0GCruxlb0ecmofN8wG1SUawGD/BllWYaTE0e\nLGVc8rDn332C3ewXGINNk26v6FBRwaRtLapuSpHD4VhIZYLt0ZAAHjeu1yr9w3i7\npydBB2d/3RIiZ42Uh4+sIhlh/isCr+eA2OCcy00CgYEAp8Yf+Yd/5h7++uNZsLMl\ndhGZonRu377hoZA2dhV5vbZksFaovGyGXknDK6rdXcpmiu+vt48Cf5qmnz6Y9Piq\nFk/NtEWePjiZiqtHFvBSyKy5tfFhgvKPL3uM6CpdQgOsCt4gtLM6wuyqxndGYxGc\n+O8xkNYFQsNrCuYHbDfJ/JA=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-lao8r@medwork-ldn.iam.gserviceaccount.com",
  "client_id": "118289720566893786692",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-lao8r%40medwork-ldn.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware para verificar o token em todas as rotas protegidas
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

router.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Rota protegida acessada com sucesso', user: req.user });
});

// Rota para verificar o usuário ao fazer login
router.post('/login', async (req, res) => {
  const { email } = req.body;
  try {
    // Use a função getNomeByEmail para obter o nome do usuário pelo email
    getNomeByEmail(email, async (err, userData) => {
      if (err) {
        console.error('Erro ao buscar usuário pelo email', err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
      }

      if (!userData) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      if (userData[0].ativo === 0) {
        return res.status(401).json({ message: 'Conta inativa' });
      }

      const user = userData[0];
      //registrarLog('login', 'login', `login`, `${user.nome_usuario}`, `${user.fk_tenant_code}`, new Date());
      res.status(200).json(user);
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});


//Rota para Logout
router.post("/logout", async (req, res) => {
  res.json({ message: 'Logout bem-sucedido!' })
})

//Selecionar Empresa
// Adicione a seguinte rota para selecionar a empresa correspondente ao id
router.get("/selectCompany/:id_empresa", (req, res) => {
  const { id_empresa } = req.params;

  const q = 'SELECT * FROM empresas WHERE id_empresa = ?';

  pool.getConnection((err, con) => {
    if (err) {
      console.error('Erro ao obter conexão do pool', err);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }

    con.query(q, [id_empresa], (err, results) => {
      con.release();

      if (err) {
        console.error('Erro ao selecionar Empresa', err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
      }

      const company = results[0];

      if (company) {
        res.status(200).json({ message: 'Empresa encontrada com sucesso', company });
      } else {
        res.status(404).json({ message: 'Empresa não encontrada' });
      }
    });
  });
});



//Validação do Token
router.post('/validate', (req, res) => {
  const getToken = req.headers.authorization;

  if (!getToken) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(getToken, SECRET);
    return res.status(200).json({ user: decoded });
  } catch (error) {
    console.error('Erro ao validar o token:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
});



// Vinculos
//Vinculando processo aos setores
//Get Table
router.get("/setores_processos", (req, res) => {
  const q = `SELECT * FROM setores_processos`;

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });

    con.release();
  })

});

//Add rows in table
router.post("/setores_processos", (req, res) => {
  const data = req.body;

  const q = "INSERT INTO setores_processos SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao vincular processo no setor", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json(`Processo vinculado com sucesso!`);
    });

    con.release();
  })

});

//Delete rows in table
router.delete("/setores_processos/:id_setor_processo", (req, res) => {
  const id_setor_processo = req.params.id_setor_processo;

  const sql = "DELETE FROM setores_processos WHERE id_setor_processo = ?";

  pool.getConnection((err, con) => {
    if (err) {
      console.error("Erro ao obter conexão do pool", err);
      return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
    }

    con.query(sql, [id_setor_processo], (err, result) => {
      if (err) {
        console.error("Erro ao deletar o vínculo", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json({ message: "Vínculo excluido com sucesso" });
    });
    con.release();

  });
});


//Vinculando riscos aos processos
//Get Table
router.get("/processos_riscos", (req, res) => {
  const q = `SELECT * FROM processos_riscos`;

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });

    con.release();
  })

});

//Add rows in table
router.post("/processos_riscos", (req, res) => {
  const data = req.body;

  const q = "INSERT INTO processos_riscos SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao vincular risco ao processo", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json(`Vinculado com sucesso!`);
    });

    con.release();
  })

});

//Delete rows in table
router.delete("/processos_riscos/:id_processo_risco", (req, res) => {
  const id_processo_risco = req.params.id_processo_risco;

  const sql = "DELETE FROM processos_riscos WHERE id_processo_risco = ?";

  pool.getConnection((err, con) => {
    if (err) {
      console.error("Erro ao obter conexão do pool", err);
      return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
    }

    con.query(sql, [id_processo_risco], (err, result) => {

      if (err) {
        console.error("Erro ao deletar o vínculo", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json({ message: "Vínculo excluido com sucesso" });
    });
    con.release();

  });
});



//Vinculando medidas aos riscos
//Get Table
router.get("/riscos_medidas", (req, res) => {
  const q = `SELECT * FROM riscos_medidas`;

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });

    con.release();
  })

});

//Add rows in table
router.post("/riscos_medidas", (req, res) => {
  const data = req.body;

  const q = "INSERT INTO riscos_medidas SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao vincular Medida de proteção ao risco", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json(`Vinculado com sucesso!`);
    });

    con.release();
  })

});

router.delete("/riscos_medidas/:id_risco_medida", (req, res) => {
  const id_risco_medida = req.params.id_risco_medida;

  const sql = "DELETE FROM riscos_medidas WHERE id_risco_medida = ?";

  pool.getConnection((err, con) => {
    if (err) {
      console.error("Erro ao obter conexão do pool", err);
      return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
    }

    con.query(sql, [id_risco_medida], (err, result) => {
      if (err) {
        console.error("Erro ao deletar o vínculo", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json({ message: "Vínculo excluido com sucesso" });
    });
    con.release();

  });
});



//Plano de Ação
//Get Table
router.get("/plano", (req, res) => {
  const q = `SELECT * FROM plano`;

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });

    con.release();
  });
});

//Add rows in table
router.post("/plano", (req, res) => {
  const data = req.body;

  const q = "INSERT INTO plano SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao cadastrar Plano de Ação", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json(`Plano de Ação adicionado com sucesso!`);
    });

    con.release();
  })

});

//Update row int table
router.put("/plano/:id_plano", (req, res) => {
  const id_plano = req.params.id_plano;

  const {
    data,
    fk_empresa_id,
    fk_unidade_id,
    fk_setor_id,
    fk_processo_id,
    fk_risco_id,
    fk_medida_id,
    tipo_medida,
    responsavel,
    prazo,
    data_conclusao,
    status
  } = req.body;

  const q = `
    UPDATE plano
    SET data = ?,
    fk_empresa_id = ?,
    fk_unidade_id = ?,
    fk_setor_id = ?,
    fk_processo_id = ?,
    fk_risco_id = ?,
    fk_medida_id = ?,
    tipo_medida = ?,
    responsavel = ?,
    prazo = ?,
    data_conclusao = ?,
    status = ?
    WHERE id_plano = ?
    `;

  const values = [
    data,
    fk_empresa_id,
    fk_unidade_id,
    fk_setor_id,
    fk_processo_id,
    fk_risco_id,
    fk_medida_id,
    tipo_medida,
    responsavel,
    prazo,
    data_conclusao,
    status,
    id_plano
  ];

  pool.getConnection((err, con) => {
    con.release();

    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar Plano de Ação", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json("Plano de Ação atualizado com sucesso!");
    });
    con.release();

  })

});




//Inventário de Riscos
//Get Table
router.get("/inventario", (req, res) => {
  const q = `SELECT * FROM inventario`;

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });

    con.release();
  });
});

//Add rows in table
router.post("/inventario", (req, res) => {
  const data = req.body;

  const q = "INSERT INTO inventario SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao cadastrar iventário", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json(`Inventário adicionado com sucesso!`);
    });

    con.release();
  })

});

//Update row int table
router.put("/inventario/:id_inventario", (req, res) => {
  const id_inventario = req.params.id_inventario;
  const {
    data_inventario,
    fk_empresa_id,
    fk_unidade_id,
    fk_setor_id,
    pessoas_expostas,
    fk_processo_id,
    fk_risco_id,
    fontes,
    medicao,
    medidas,
    probabilidade,
    nivel,
    frequencia,
    fk_aparelho_id,
    comentarios,
    conclusao_ltcat,
    conclusao_li,
    conclusao_lp,
  } = req.body;

  const q = `
    UPDATE inventario
    SET data_inventario = ?,
    fk_empresa_id = ?,
    fk_unidade_id = ?,
    fk_setor_id = ?,
    pessoas_expostas = ?,
    fk_processo_id = ?,
    fk_risco_id = ?,
    fontes = ?,
    medicao = ?,
    medidas = ?,
    probabilidade = ?,
    nivel = ?,
    frequencia = ?,
    fk_aparelho_id = ?,
    comentarios = ?,
    conclusao_ltcat = ?,
    conclusao_li = ?,
    conclusao_lp = ?
    WHERE id_inventario = ?
    `;

  const values = [
    data_inventario,
    fk_empresa_id,
    fk_unidade_id,
    fk_setor_id, pessoas_expostas,
    fk_processo_id,
    fk_risco_id,
    fontes,
    medicao,
    medidas,
    probabilidade,
    nivel,
    frequencia,
    fk_aparelho_id,
    comentarios,
    conclusao_ltcat,
    conclusao_li,
    conclusao_lp,
    id_inventario,
  ];

  pool.getConnection((err, con) => {
    con.release();

    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar Inventário", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json("Inventário atualizado com sucesso!");
    });
    con.release();

  })

});




//Tabela Global SPRM
//Get Table
router.get("/global_sprm", (req, res) => {
  const q = `SELECT * FROM global_sprm`;

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });

    con.release();
  });
});

// Verifica se a combinação existe na tabela global_sprm
router.get("/verificar_sprm", async (req, res) => {
  try {
    const { fk_setor_id, fk_processo_id, fk_risco_id, fk_medida_id } = req.query;

    if (!fk_setor_id || !fk_processo_id || !fk_risco_id || !fk_medida_id) {
      return res.status(400).json({ error: 'Parâmetros insuficientes' });
    }

    // Execute uma consulta SQL para verificar a existência
    const q = `
      SELECT * FROM global_sprm
      WHERE fk_setor_id = ? AND fk_processo_id = ? AND fk_risco_id = ? AND fk_medida_id = ?
    `;

    pool.query(q, [fk_setor_id, fk_processo_id, fk_risco_id, fk_medida_id], (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      const existeCombinação = data.length > 0;

      return res.status(200).json({ existeCombinação });
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

//Add rows in table
router.post("/global_sprm", (req, res) => {
  const data = req.body;

  const q = "INSERT INTO global_sprm SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao cadastrar medidas no setor", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json(`Medidas adicionadas com sucesso!`);
    });

    con.release();
  })

});

//Update rowns in table
router.put("/global_sprm/:id_global_sprm", (req, res) => {
  const id_global_sprm = req.params.id_global_sprm;
  const { status } = req.body;

  const q = `
    UPDATE global_sprm SET status = ? WHERE id_global_sprm = ?`;

  const values = [status, id_global_sprm];

  pool.getConnection((err, con) => {
    con.release();

    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar medidas no setor", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json("Medida atualizada com sucesso!");
    });
  })
});

// Update EPI
router.put("/update_epi_sprm/:id_global_sprm", (req, res) => {
  const id_global_sprm = req.params.id_global_sprm;
  const { certificado_epi, vencimento_certificado_epi, fator_reducao_epi, fabricante_epi } = req.body;

  const q = `UPDATE global_sprm SET certificado_epi = ?, vencimento_certificado_epi = ?, fator_reducao_epi = ?, fabricante_epi = ? WHERE id_global_sprm = ?`;

  const values = [certificado_epi, vencimento_certificado_epi, fator_reducao_epi, fabricante_epi, id_global_sprm];

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, values, (err) => {
      if (err) {
        console.error("Erro ao atualizar medida no setor", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }
      return res.status(200).json("Medida atualizada com sucesso!");
    });
  })
});




router.post("/elaboradores", (req, res) => {
  const data = req.body;
  const nome = req.query.nome_usuario
  const tenant = req.query.tenant_code


  const q = "INSERT INTO elaboradores SET ?"

  pool.getConnection((err, con) => {
    if (err) return next(err);

    con.query(q, data, (err, result) => {
      if (err) {
        console.error("Erro ao cadastrar medidas no setor", err);
        return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
      }

      return res.status(200).json(`Medidas adicionadas com sucesso!`);
    });
    const formatBody = (obj) => {
      let formatted = '';
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          formatted += `${key}: ${obj[key]}, `;
        }
      }
      return formatted.slice(0, -2); // Remove a última vírgula e espaço
    };
    const bodyString = formatBody(data)
    registrarLog('elaboradores', 'create', `Cadastrou Elaborador`, `${nome}`, tenant, new Date(), bodyString);

    con.release();
  })

});

// router.route('/:table')
//   .post(async (req, res) => {
//     const table = req.params.table;
//     const data = req.body;
// const nome = req.query.nome_usuario
//     const tenant = req.query.tenant_code

//     const q = `INSERT INTO ${table} SET ?`

//     pool.getConnection((err, con) => {
//       if (err) return next(err);

//       con.query(q, data, (err, result) => {
//         if (err) {
//           console.error(`Erro ao registrar dado na tabela ${table}. Status: ${err}`);
//           return res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
//         }

// const formatBody = (obj) => {
//   let formatted = '';
//   for (const key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       formatted += `${key}: ${obj[key]}, `;
//     }
//   }
//   return formatted.slice(0, -2); // Remove a última vírgula e espaço
// };
// const bodyString = formatBody(data)

//         registrarLog('elaboradores', 'create', `Cadastrou Elaborador`, `${nome}`, tenant, new Date(), bodyString);

//         return res.status(200).json(`Registro concluido com sucesso!`)
//       });

//       con.release();
//     })
//   })


//Tabela Elaboradores
//Get table
router.get("/elaboradores", (req, res) => {
  const queryParams = req.query.tenent_code;


  getElaboradoresfromTenant(queryParams)
    .then(data => {

      return res.status(200).json(data);
    })
    .catch(error => {
      return res.status(500).json(error);
    });

});

router.put("/elaboradores/activate/:id_elaborador", (req, res) => {
  const id_elaborador = req.params.id_elaborador;
  const { ativo } = req.body;

  const q = 'UPDATE elaboradores SET ativo = ? WHERE id_elaborador = ?';
  const values = [ativo, id_elaborador];

  pool.getConnection((err, con) => {
    if (err) return res.status(500).json({ error: 'Erro ao obter conexão.' });

    con.query(q, values, (err) => {
      con.release();

      if (err) {
        console.error('Erro ao atualizar status do elaborador:', err);
        return res.status(500).json({ error: 'Erro ao atualizar status do elaborador.' });
      }

      res.status(200).json({ message: 'Status da unidade atualizado com sucesso.' });
    });
  });
});




export default router;