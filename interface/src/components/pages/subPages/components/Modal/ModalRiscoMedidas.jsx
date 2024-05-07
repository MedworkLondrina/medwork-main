import React, { useEffect, useState } from 'react';
import { connect } from '../../../../../services/api';
import { IoAddCircle } from "react-icons/io5";
import { toast } from 'react-toastify';
import useAuth from '../../../../../hooks/useAuth';

import ModalSearchMedidas from './ModalSearchMedidas'

const ModalRiscoMedidas = ({ onCancel, isOpen, childName, childId, children }) => {

  const { fetchMedidas, getRiscosMedidas } = useAuth(null);
  const [riscosMedidas, setRiscosMedidas] = useState([]);
  const [medida, setMedida] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchRiscosMedidas = async () => {
    try {
      const response = await getRiscosMedidas();
      const filterByMedida = response.filter((c) => c.fk_risco_id === childId)
      setRiscosMedidas(filterByMedida);
    } catch (error) {
      console.log("Erro ao buscar riscos e medidas!", error);
    }
  };

  const fetchMedidasGeral = async () => {
    try {
      const med = await fetchMedidas("all");
      setMedida(med);
    } catch (error) {
      console.log("Erro ao buscar medidas!", error)
    }
  };

  useEffect(() => {
    fetchMedidasGeral();
    fetchRiscosMedidas();
  }, [childId])


  if (!isOpen) {
    return null;
  };

  const findMedidas = (FkMedidaId) => {
    const filterMedida = medida.find((i) => i.id_medida === FkMedidaId);
    return filterMedida ? filterMedida.descricao_medida : 'N/A';

  };

  //Funções do Modal
  //Função para abrir o Modal
  const openModal = () => setShowModal(true);
  //Função para fechar o Modal
  const closeModal = () => setShowModal(false);

  const selectedSetor = async (item) => {
    try {
      const filteredRiscosMedidas = riscosMedidas.filter((i) => i.fk_risco_id === childId && i.fk_medida_id === item);

      if (filteredRiscosMedidas.length > 0) {
        toast.warn(`Medida já vinculada ao risco.`);
        return;
      }

      const response = await fetch(`${connect}/riscos_medidas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          fk_risco_id: childId,
          fk_medida_id: item,
        }])
      });

      if (!response.ok) {
        throw new Error(`Erro ao vincular medida de proteção ao risco. Status: ${response.status}`);
      }
      const responseData = await response.json();

      closeModal();
      fetchRiscosMedidas();
      toast.success(responseData);
    } catch (error) {
      console.log("Erro ao vincular medida de proteção ao risco", error);
      toast.warn("Erro ao vincular medida de proteção");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay absolute inset-0 backdrop-blur-[1px] bg-black bg-opacity-10" onClick={onCancel}></div>
      <div className="modal-container w-5/6 bg-white mx-auto rounded-xl z-50 overflow-y-auto px-8 py-4 max-h-[80vh]">
        <div className='flex justify-between items-center py-2'>
          <h1 className='text-xl font-bold text-sky-700'>Adicione Medidas ao risco: <span className='text-xl text-gray-700 font-bold'>{childName}</span></h1>
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
        <div className='py-2'>
          <p className='text-sm text-gray-600 mb-1'>
            Para vincular uma medida, clique no botão abaixo e selecione a medida na lista:
          </p>

          {/* Botão Vincular Processo */}
          <div
            className='bg-gray-100 hover:bg-gray-200 text-sky-700 py-3 px-4 rounded-md flex items-center gap-1 justify-center cursor-pointer'
            onClick={openModal}
          >
            <IoAddCircle />
            <p className=' font-bold'>
              Vincular Medidas
            </p>
          </div>
        </div>
        <hr />

        {/* Lista de Processos */}
        {riscosMedidas.length > 0 ? (
          <>
            <div className='w-full mt-1'>
              <h1 className='mb-2'>Medidas Vinculadas</h1>
              <div className='flex flex-wrap items-center gap-2'>
                {riscosMedidas.map((item) => (
                  <div key={item.fk_processo_id}>
                    <div className='flex items-center bg-gray-100 rounded px-4 py-2 hover:bg-gray-200'>
                      <p className='font-bold text-sky-700 truncate'>
                        {findMedidas(item.fk_medida_id)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='w-full text-center text-lg text-sky-700 font-bold mt-4'>Nenhuma medida vinculada ao risco</div>
          </>
        )}

      </div>


      <ModalSearchMedidas
        isOpen={showModal}
        onCancel={closeModal}
        onSelect={selectedSetor}
      />
    </div>
  );
};


export default ModalRiscoMedidas;
