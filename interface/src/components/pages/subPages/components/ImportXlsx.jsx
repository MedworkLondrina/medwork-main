import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { connect } from "../../../../services/api";

const ImportXlsx = () => {
  const [file, setFile] = useState(null);
  const [allDataArray, setAllDataArray] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [importSuccess, setImportSuccess] = useState(false);

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


  
  const processFile = async (file) => {
    // Função para calcular a idade a partir da data de nascimento
    const calcularIdade = (dataNascimento) => {
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
        (dataAtual.getMonth() === mesNascimento && dataAtual.getDate() < diaNascimento)
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
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1});
  
      const headers = jsonData[0];
      const rows = jsonData.slice(2);
  
      const unidades = {};
  
      rows.forEach((row) => {
        const unidadeKey = row[1]; // Coluna 0: id_unidade
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
            setores: {}
          };
        }
  
        // Verifica se o setor já foi criado na unidade atual, se não, cria
        if (!Object.values(unidades[unidadeKey].setores).some(setor => setor.nome_setor === setorNome)) {
          const setorKey = row[3]; // Coluna 3: id_setor
  
          unidades[unidadeKey].setores[setorKey] = {
            nome_setor: setorNome,
            ambiente_setor: "N/A",
            observacao_setor: "N/A",
            fk_unidade_id: unidadeKey,
            ativo: 1,
            fk_empresa_id: empresa_id,
            cargos: {}
          };
        }
  
        // Adiciona o cargo ao setor existente com o mesmo nome
        const setorKey = Object.keys(unidades[unidadeKey].setores).find(key => unidades[unidadeKey].setores[key].nome_setor === setorNome);
  
        const cargoNome = row[5]; // Coluna 5: nome_cargo
        const sexo = row[10]; // Coluna 10: Sexo
        const dataNascimento = row[9]; // Coluna 9: Dt.Nascimento
        console.log(dataNascimento)
        const idadeFuncionario = calcularIdade(dataNascimento);
        const menorDeIdade = idadeFuncionario < 18;
  
        // Verifica se o cargo já existe no setor atual
        if (unidades[unidadeKey].setores[setorKey].cargos[cargoNome]) {
          // Se o cargo já existe, acumula as contagens de funcionários por sexo
          if (sexo === 'M') {
            unidades[unidadeKey].setores[setorKey].cargos[cargoNome].func_masc++;
          } else if (sexo === 'F') {
            unidades[unidadeKey].setores[setorKey].cargos[cargoNome].func_fem++;
          }
  
          if (menorDeIdade) {
            unidades[unidadeKey].setores[setorKey].cargos[cargoNome].func_menor++;
          }
        } else {
          // Se o cargo não existe, cria um novo com as contagens correspondentes
          unidades[unidadeKey].setores[setorKey].cargos[cargoNome] = {
            nome_cargo: cargoNome,
            descricao: row[65],
            func_masc: sexo === 'M' ? 1 : 0,
            func_fem: sexo === 'F' ? 1 : 0,
            func_menor: menorDeIdade ? 1 : 0,
            fk_setor_id: setorKey,
            ativo: 1,
            fk_empresa_id: empresa_id
          };
        }
      });
  
      const unidadeData = Object.values(unidades).map((unidade) => {
        unidade.setores = Object.values(unidade.setores).map((setor) => {
          setor.cargos = Object.values(setor.cargos);
          return setor;
        });
        return unidade;
      });
  
      setGroupedData({ unidadeData });
      setImportSuccess(true);
    } catch (error) {
      console.error("Erro ao processar o arquivo:", error);
    }
  };
  
  
  
  const handleSendData = async () => {
    try {
      // 
      console.log(groupedData.unidadeData);
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-10">
        <h3 className="font-black text-sky-700 text-5xl">Importar Dados</h3>
      </div>
      <div className="flex items-center justify-center w-2/3 mx-auto mt-10">
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
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
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
      <div className="relative overflow-x-auto sm:rounded-lg flex sm:justify-center">
        {allDataArray && allDataArray.length > 0 && (
          <table className="w-full xl:w-5/6 shadow-md text-sm m-8 text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                {Object.keys(allDataArray[0]).map((header) => (
                  <th scope="col" className="px-6 py-3" key={header}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allDataArray.map((item, index) => (
                <tr className="border-b" key={index}>
                  {Object.values(item).map((value, subIndex) => (
                    <td
                      scope="row"
                      className="px-6 py-4 text-gray-700 whitespace-pre-line"
                      key={subIndex}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div
        style={{
          alignItems: "center",
          justifyContent: "end",
          display: "flex",
          marginRight: "30px",
        }}
      >
        <button
          className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={handleSendData}
        >
          Enviar
        </button>
      </div>
    </>
  );
};

export default ImportXlsx;
