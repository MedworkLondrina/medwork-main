import React, { useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { connect } from "../../../../services/api";

const ImportXlsx = () => {
  const [file, setFile] = useState(null);
  const [groupedData, setGroupedData] = useState({});
  const [importSuccess, setImportSuccess] = useState(false);
  const [contacts, setContacts] = useState({});
  const [setorEdits, setSetorEdits] = useState({});
  const [atualizouSetor, setAtualizouSetor] = useState(false);

  const handleOnChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      processFile(selectedFile);
    }
    setImportSuccess(false);
  };

  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  const handleClear = () => {
    setImportSuccess(false);
    setAtualizouSetor(false);
    setGroupedData({});
    setSetorEdits({});
    setContacts({});
    setFile(null);
  }

  const processFile = async (file) => {
    // Função para calcular a idade a partir da data de nascimento
    const calcularIdade = (dataNascimento) => {
      if (!dataNascimento) {
        return;
      }
      const dataAtual = new Date();
      const dataNascimentoLimpa = dataNascimento.trim(); // Remove espaços em branco
      const partesData = dataNascimentoLimpa.split("/");
      const diaNascimento = parseInt(partesData[0]);
      const mesNascimento = parseInt(partesData[1]) - 1; // Mês começa do zero
      const anoNascimento = parseInt(partesData[2]);
      const idade = dataAtual.getFullYear() - anoNascimento;

      // Verifica se já fez aniversário este ano
      if (
        dataAtual.getMonth() < mesNascimento ||
        (dataAtual.getMonth() === mesNascimento &&
          dataAtual.getDate() < diaNascimento)
      ) {
        return idade - 1;
      }

      return idade;
    };

    try {
      const empresa = JSON.parse(localStorage.getItem("selectedCompanyData"));
      const empresa_id = empresa.id_empresa;

      const data = await readFileAsync(file);
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const headers = jsonData[0];
      const rows = jsonData.slice(2);

      const unidades = {};

      rows.forEach((row) => {
        const unidadeKey = row[1]; // Coluna 1: id_unidade
        const setorNome = row[3]; // Coluna 3: nome_setor

        // Verifica se a unidade já foi criada, se não, cria
        if (!unidades[unidadeKey]) {
          unidades[unidadeKey] = {
            nome_unidade: row[1],
            cnpj_unidade: row[38],
            cep_unidade: row[37],
            endereco_unidade: row[33],
            numero_unidade: row[66],
            complemento: row[47],
            bairro_unidade: row[34],
            cidade_unidade: row[35],
            uf_unidade: row[36],
            fk_contato_id: 1,
            fk_empresa_id: empresa_id,
            ativo: 1,
            setores: {},
          };
        }

        // Verifica se o setor já foi criado na unidade atual, se não, cria
        if (
          !Object.values(unidades[unidadeKey].setores).some(
            (setor) => setor.nome_setor === setorNome
          )
        ) {
          const setorKey = row[3]; // Coluna 3: id_setor

          unidades[unidadeKey].setores[setorKey] = {
            nome_setor: setorNome,
            ambiente_setor: null,
            observacao_setor: null,
            fk_unidade_id: unidadeKey,
            ativo: 1,
            fk_empresa_id: empresa_id,
            cargos: {},
          };
        }

        // Adiciona o cargo ao setor existente com o mesmo nome
        const setorKey = Object.keys(unidades[unidadeKey].setores).find(
          (key) => unidades[unidadeKey].setores[key].nome_setor === setorNome
        );

        const cargoNome = row[5]; // Coluna 5: nome_cargo
        const sexo = row[10]; // Coluna 10: Sexo
        const dataNascimento = row[9]; // Coluna 9: Dt.Nascimento
        const idadeFuncionario = calcularIdade(dataNascimento);
        const menorDeIdade = idadeFuncionario < 18;

        // Verifica se o cargo já existe no setor atual
        if (unidades[unidadeKey].setores[setorKey].cargos[cargoNome]) {
          // Se o cargo já existe, acumula as contagens de funcionários por sexo
          if (sexo === "M") {
            if (menorDeIdade) {
              unidades[unidadeKey].setores[setorKey].cargos[cargoNome]
                .func_masc--;
              return;
            }
            unidades[unidadeKey].setores[setorKey].cargos[cargoNome]
              .func_masc++;
          } else if (sexo === "F") {
            if (menorDeIdade) {
              unidades[unidadeKey].setores[setorKey].cargos[cargoNome]
                .func_fem--;
              return;
            }
            unidades[unidadeKey].setores[setorKey].cargos[cargoNome].func_fem++;
          }

          if (menorDeIdade) {
            unidades[unidadeKey].setores[setorKey].cargos[cargoNome]
              .func_menor++;
          }
        } else {
          // Se o cargo não existe, cria um novo com as contagens correspondentes
          unidades[unidadeKey].setores[setorKey].cargos[cargoNome] = {
            nome_cargo: cargoNome,
            descricao: row[65],
            func_masc: sexo === "M" ? 1 : 0,
            func_fem: sexo === "F" ? 1 : 0,
            func_menor: menorDeIdade ? 1 : 0,
            fk_setor_id: setorKey,
            ativo: 1,
            fk_empresa_id: empresa_id,
          };

          // Após a inicialização, ajustar os contadores se o funcionário for menor de idade
          if (menorDeIdade) {
            if (sexo === "M") {
              unidades[unidadeKey].setores[setorKey].cargos[cargoNome]
                .func_masc--;
            } else if (sexo === "F") {
              unidades[unidadeKey].setores[setorKey].cargos[cargoNome]
                .func_fem--;
            }
          }
        }
      });

      const unidadeData = Object.values(unidades)
        .filter((unidade) => unidade.nome_unidade && unidade.cnpj_unidade)
        .map((unidade) => {
          unidade.setores = Object.values(unidade.setores)
            .filter((setor) => setor.nome_setor)
            .map((setor) => {
              setor.cargos = Object.values(setor.cargos).filter((cargo) => cargo.nome_cargo);
              return setor;
            });
          return unidade;
        });

      console.log(unidadeData)
      setGroupedData({ unidadeData });
      setImportSuccess(true);
    } catch (error) {
      console.error("Erro ao processar o arquivo:", error);
    }
  };

  const handleSendData = async () => {
    console.log(groupedData);

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const empresa = JSON.parse(localStorage.getItem("selectedCompanyData"));
      const empresa_id = empresa.id_empresa;
      const tenant = userData.tenant_code;
      const nome = userData.nome_usuario;
      const queryParams = new URLSearchParams({ tenant_code: tenant, nome_usuario: nome, id_empresa: empresa_id }).toString();
      const res = await fetch(`${connect}/unidade_import?${queryParams}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupedData),
      });
      if (!res.ok) {
        throw new Error(`Erro ao inserir exame. Status: ${res.status}`);
      }

      const data = await res.json();
      toast.success(data);
      handleClear();

    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
    }
  };

  const handleSetorChange = (unidadeKey, setorKey, field, value) => {
    setSetorEdits((prevEdits) => ({
      ...prevEdits,
      [unidadeKey]: {
        ...prevEdits[unidadeKey],
        [setorKey]: {
          ...prevEdits[unidadeKey]?.[setorKey],
          [field]: value,
        },
      },
    }));
  };

  const handleUpdateSetores = () => {
    const updatedGroupedData = { ...groupedData };
    let allDescriptionsFilled = true;

    // Verifica se algum campo de ambiente_setor está vazio
    Object.keys(setorEdits).forEach((unidadeKey) => {
      Object.keys(setorEdits[unidadeKey]).forEach((setorKey) => {
        const setorEdit = setorEdits[unidadeKey][setorKey];
        if (!setorEdit.ambiente_setor || setorEdit.ambiente_setor.trim() === "") {
          allDescriptionsFilled = false;
          console.log('Campo de descrição do setor vazio');
        }
      });
    });

    // Se algum campo estiver vazio, exibe mensagem de erro e retorna
    if (!allDescriptionsFilled) {
      toast.error('Todos os campos de descrição do setor devem estar preenchidos.');
      return;
    }

    // Atualiza os dados agrupados com as mudanças
    Object.keys(setorEdits).forEach((unidadeKey) => {
      Object.keys(setorEdits[unidadeKey]).forEach((setorKey) => {
        const setor = updatedGroupedData.unidadeData
          .find((unidade) => unidade.nome_unidade === unidadeKey)
          .setores.find((setor) => setor.nome_setor === setorKey);
        if (setor) {
          Object.assign(setor, setorEdits[unidadeKey][setorKey]);
        }
      });
    });

    // Verifica se todas as descrições de setores estão preenchidas após a atualização
    const allDescriptionsFilledAfterUpdate = updatedGroupedData.unidadeData.every((unidade) => {
      return unidade.setores.every((setor) => setor.ambiente_setor && setor.ambiente_setor.trim() !== "");
    });

    // Se todas as descrições de setores estiverem preenchidas, define atualizouSetor como true
    if (allDescriptionsFilledAfterUpdate) {
      setAtualizouSetor(true);
    } else {
      setAtualizouSetor(false);
    }
  };


  return (
    <>
      {/* Cabeçalho */}
      <div className="flex justify-center mt-10">
        <h3 className="font-black text-sky-700 text-5xl">Importar Dados</h3>
      </div>

      {/* Input */}
      <div className={`flex items-center justify-center w-2/3 mx-auto mt-10 ${importSuccess ? '' : 'mb-20'}`}>
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H4a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h3m3 0v3m0 0l-3-3m3 3 3-3"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Selecione um arquivo</span> ou
              arraste e solte
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Apenas XLSX
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleOnChange}
          />
        </label>
      </div>
      {importSuccess && (
        <div className="text-green-600 font-semibold text-center mb-4 mt-2">
          Dados importados com sucesso!
        </div>
      )}

      {/* Editar Setores */}
      {importSuccess && (
        <div className="w-5/6 mx-auto mt-10 mb-10 rounded-md shadow-md border px-5 py-3">
          <div className="w-full">
            <h4 className="font-bold text-3xl text-center text-sky-700 mb-2">Editar Setores</h4>
            {groupedData.unidadeData &&
              groupedData.unidadeData.map((unidade, unidadeIndex) => (
                // Unidades
                <div key={unidadeIndex} className={`mb-6 py-2 px-4`}>
                  {/* Titulo */}
                  <div>
                    <p className="text-gray-600 text-md">Unidade:</p>
                    <h5 className="font-semibold text-lg -mt-1 text-sky-700">{unidade.nome_unidade}</h5>
                  </div>
                  {unidade.setores.map((setor, setorIndex) => (
                    // Setores
                    <div
                      key={setorIndex}
                      className="mb-2 border-b px-4 border-gray-400"
                    >
                      {/* Titulo Setor */}
                      <div>
                        <p className="text-gray-600 text-md">Setor:</p>
                        <h5 className="font-semibold -mt-1 text-sky-700">{setor.nome_setor}</h5>
                      </div>

                      {/* Inputs Setor */}
                      <div className="w-full flex items-center gap-4">
                        {/* Descrição do Setor */}
                        <div className="w-full md:w-1/2 px-3 md:px-0">
                          <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={`ambiente_${unidadeIndex}_${setorIndex}`}>
                            Descrição do Setor
                          </label>
                          <input
                            className="appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-none"
                            placeholder="Descrição do Setor"
                            id={`ambiente_${unidadeIndex}_${setorIndex}`}
                            type="text"
                            value={
                              setorEdits[unidade.nome_unidade]?.[setor.nome_setor]
                                ?.ambiente_setor || setor.ambiente_setor
                            }
                            onChange={(e) => {
                              if (e.target.value.trim() !== "") {
                                handleSetorChange(
                                  unidade.nome_unidade,
                                  setor.nome_setor,
                                  "ambiente_setor",
                                  e.target.value
                                );
                              }
                            }}
                          />
                        </div>

                        {/* Observação do Setor */}
                        <div className="w-full md:w-1/2 px-3 md:px-0">
                          <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={`ambiente_${unidadeIndex}_${setorIndex}`}>
                            Observação do Setor
                          </label>
                          <input
                            className="appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-none"
                            id={`observacao_${unidadeIndex}_${setorIndex}`}
                            type="text"
                            placeholder="Observação do Setor"
                            value={
                              setorEdits[unidade.nome_unidade]?.[setor.nome_setor]
                                ?.observacao_setor || setor.observacao_setor
                            }
                            onChange={(e) =>
                              handleSetorChange(
                                unidade.nome_unidade,
                                setor.nome_setor,
                                "observacao_setor",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            <div className="flex justify-end items-center gap-4">
              {/* Atualizar Setores */}
              <button
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={handleUpdateSetores}
              >
                Atualizar Setores
              </button>

              {/* Enviar */}
              <button
                className={
                  !atualizouSetor
                    ? "bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 opacity-60 cursor-not-allowed"
                    : "bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded mt-4"
                }
                onClick={handleSendData}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImportXlsx;
