import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {connect} from "../../../../services/api";

const ImportXlsx = () => {
  const [file, setFile] = useState(null);
  const [allDataArray, setAllDataArray] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [importSuccess, setImportSuccess] = useState(false);

  const handleOnChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      xlsxFileToArray(selectedFile);
    }

    setImportSuccess(false);
  };

  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsBinaryString(file);
    });
  };

  const xlsxFileToArray = async (file) => {
    try {
      const empresa = localStorage.getItem('selectedCompanyData');
     
      const empresaObj = JSON.parse(empresa);


      // Acessando a propriedade id_empresa
      const empresa_id = empresaObj.id_empresa;
      
      
      const data = await readFileAsync(file);
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const groupedData = {};

      jsonData.forEach((item) => {
        const nomeContato = item['nome_contato'];
        const telefoneContato = item['telefone_contato'];
        const emailContato = item['email_contato'];
        const emailSecundarioContato = item['email_secundario_contato'];

        if (!groupedData[nomeContato]) {
          groupedData[nomeContato] = {
            nome_contato: nomeContato,
            telefone_contato: telefoneContato,
            email_contato: emailContato,
            email_secundario_contato: emailSecundarioContato,
            ativo:1,
            fk_empresa_id: empresa_id
          };
        }
      });

      setAllDataArray(jsonData);
      setGroupedData(groupedData);
      setImportSuccess(true);

      console.log("Dados Agrupados por Contato:");
      console.log(groupedData);

      const jsonString = JSON.stringify(groupedData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });

      saveAs(blob, "dados.json");
    } catch (error) {
      console.error("Erro ao processar o arquivo:", error);
    }
  };

  const handleSendData = async () => {
    try {
      const user = localStorage.getItem('user');
      const userObj = JSON.parse(user);
      const tenant = userObj.tenant_code;
      const nome = userObj.nome_usuario;

      const queryParams = new URLSearchParams({ tenant_code: tenant, nome_usuario: nome }).toString();


      const response = await fetch(`${connect}/contatos?${queryParams}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.values(groupedData)),
      });

      if (response.ok) {
        console.log("Dados enviados com sucesso!");
      } else {
        console.error("Erro ao enviar os dados:", response.statusText);
      }
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
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Selecione um arquivo</span> ou arraste e solte</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Apenas XLSX</p>
          </div>
          <input id="dropzone-file" type="file" accept=".xlsx" className="hidden" onChange={handleOnChange} />
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
      <div style={{alignItems: 'center', justifyContent: 'end', display: 'flex', marginRight: '30px'}}>
        <button className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded mt-4" onClick={handleSendData}>
          Enviar
        </button>
      </div>
    </>
  );
};

export default ImportXlsx;
