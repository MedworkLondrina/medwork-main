import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { connect } from '../../../../../services/api';
import ModalEpi from './ModalEPI';

const ModalMedidasDefine = ({ onCancel, isOpen, companyName, globalSprm, medidas, medidasDefine, plano, getGlobalSprm }) => {

  const [selectedStatus, setSelectedStatus] = useState({});
  const [filteredMedidas, setFilteredMedidas] = useState([]);
  const [showModalEpi, setShowModalEpi] = useState(false);
  const [globalId, setGlobalId] = useState('');
  const [globalData, setGlobalData] = useState('');


  useEffect(() => {
    if (globalSprm) {
      const initialStatus = {};
      globalSprm.forEach(item => {
        initialStatus[item.fk_medida_id] = item.status || "0"; // Assumindo que status é uma string
      });
      setSelectedStatus(initialStatus);
    }
  }, [globalSprm]);


  useEffect(() => {
    const mapSprm = globalSprm.map((i) => i.fk_medida_id);
    const filterMedidas = medidas.filter((i) => mapSprm.includes(i.id_medida));
    setFilteredMedidas(filterMedidas);
  }, [isOpen, globalSprm]);

  const handleAplicationChange = async (event, itemId) => {
    const selectedApply = event.target.value;
    let status = "";

    if (plano && selectedApply === "Aplica") {
      return toast.warn("Medida não pode ser modificada!");
    }

    if (selectedApply === "Aplica" || selectedApply === "Não Aplica" || selectedApply === "Não Aplicavel") {
      status = selectedApply;
    }

    // Encontrar o item específico em globalSprm com base no itemId
    const item = globalSprm.find((i) => i.fk_medida_id === itemId);

    if (!item) {
      console.error("Item não encontrado na lista globalSprm");
      return;
    }

    try {
      const response = await fetch(`${connect}/global_sprm/${item.id_global_sprm}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao alterar status da medida. Status: ${response.status}`);
      }

      const data = await response.json();
      toast.success(`Status atualizado para ${selectedApply} com sucesso`);

      setSelectedStatus(prevState => ({
        ...prevState,
        [itemId]: status,
      }));
    } catch (error) {
      console.error("Erro ao mudar status da medida!", error);
      toast.error("Erro ao mudar status da medida.");
    }
  };

  const handleEditEpi = async (idMedida) => {
    getGlobalSprm();
    console.log(globalSprm)
    const filter = globalSprm.find((i) => i.fk_medida_id === idMedida);
    setGlobalId(filter.id_global_sprm);
    setGlobalData(filter);
    openModalEpi();
  };

  const findStatus = (itemId) => {
    const find = globalSprm.find((i) => i.fk_medida_id === itemId);
    return find ? find.status : 'N/A';
  };

  // Funções do Modal
  const openModalEpi = () => {
    setShowModalEpi(true);
  };

  const closeModalEpi = () => {
    getGlobalSprm();
    setShowModalEpi(false);
  };

  if (!isOpen || !globalSprm) {
    return null;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay absolute inset-0 backdrop-blur-[1px] bg-black bg-opacity-10" onClick={onCancel}></div>
      <div className="modal-container w-5/6 bg-white mx-auto rounded-xl z-50 overflow-y-auto px-8 py-4 max-h-[80vh]">
        <div className='flex justify-between items-center py-2'>
          <h1 className='text-xl font-bold text-sky-700'>Defina a aplicabilidade das medidas para empresa <span className='text-xl text-gray-700 font-bold'>{companyName}</span></h1>
          <div className="flex justify-end">
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8"
              onClick={onCancel}>
              <svg className="flex m-auto w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>
        </div>
        <div className='border-b border-gray-200'></div>
        <p className='text-sm text-gray-500'>
          "Por favor, selecione as medidas que a empresa adota marcando as caixas de seleção na tabela abaixo e clique em 'Aplicar'."
        </p>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex sm:justify-center mt-10 mb-8 max-w-full">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Medida
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Tipo
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Dados do EPI
                </th>
              </tr>
            </thead>
            <tbody>
              {globalSprm && filteredMedidas.map((item, i) => (
                <tr
                  key={i}
                  className={`border-b bg-white`}
                >
                  <td className="px-4 py-4 min-w-[100px] max-w-[200px] whitespace-normal">
                    <p className='max-w-full'>
                      {item.descricao_medida}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {item.grupo_medida}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      className="w-full appearence-none bg-gray-100 rounded py-3 px-4 leading-tight"
                      name="aplicacao_medida"
                      id="aplicacao_medida"
                      onChange={(event) => handleAplicationChange(event, item.id_medida)}
                      value={selectedStatus[item.id_medida] || "0"}
                    >
                      <option value="0">Selecione uma aplicação</option>
                      <option value="Aplica" disabled={plano}>Aplica</option>
                      <option value="Não Aplica">Não Aplica</option>
                      <option value="Não Aplicavel">Não Aplicavel</option>
                    </select>
                  </td>
                  <td className="text-center">
                    {item.grupo_medida === 'MI' && !plano ? (
                      <div className='w-full' onClick={() => handleEditEpi(item.id_medida)}>
                        <div className='inline-flex py-2 px-4 rounded bg-sky-600 text-white font-bold text-xs cursor-pointer hover:bg-sky-700'>
                          Adicionar dados
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className='w-full'>
                          <div className='inline-flex py-2 px-4 rounded bg-gray-100 text-gray-500 font-medium text-xs cursor-not-allowed'>
                            Adicionar dados
                          </div>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='flex justify-end items-center'>
          <button
            onClick={medidasDefine}
            className="shadow mt-4 bg-green-500 hover:bg-green-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit"
          >
            Aplicar
          </button>
        </div>
      </div>
      <ModalEpi
        isOpen={showModalEpi}
        onCancel={closeModalEpi}
        idGlobal={globalId}
        globalData={globalData}
      />
    </div>
  );
};


export default ModalMedidasDefine;
