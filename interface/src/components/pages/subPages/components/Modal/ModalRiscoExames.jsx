import React, { useEffect, useState } from 'react';
import { connect } from '../../../../../services/api';
import { IoAddCircle } from "react-icons/io5";
import { toast } from 'react-toastify';
import useAuth from '../../../../../hooks/useAuth';

import ModalSearchExamesRiscos from './ModalSearchExamesRiscos';

const ModalRiscoExames = ({ onCancel, isOpen, childName, childId, children, exames }) => {

  const {getRiscosExamesComVinculo } = useAuth(null);
  const [riscosExames, setRiscosExames] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchRiscosExames = async () => {
    try { 
      const response = await getRiscosExamesComVinculo(childId);
      setRiscosExames(response);
    } catch (error) {
      console.log("Erro ao buscar vinculos entre riscos e exames!", error);
    }
  };

  const atualizarDados  = async () => {
    fetchRiscosExames();
  }

  useEffect(() => {
    fetchRiscosExames();
  }, [childId])


  if (!isOpen) {
    return null;
  };

  
  //Funções do Modal
  //Função para abrir o Modal
  const openModal = () => setShowModal(true);
  //Função para fechar o Modal
  const closeModal = () => {
    setShowModal(false)
    atualizarDados();
  }
  

 

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay absolute inset-0 backdrop-blur-[1px] bg-black bg-opacity-10" onClick={onCancel}></div>
      <div className="modal-container w-5/6 bg-white mx-auto rounded-xl z-50 overflow-y-auto px-8 py-4 max-h-[80vh]">
        <div className='flex justify-between items-center py-2'>
          <h1 className='text-xl font-bold text-sky-700'>Adicione Exames ao risco: <span className='text-xl text-gray-700 font-bold'>{childName}</span></h1>
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
            Para vincular um exame, clique no botão abaixo e selecione o exame na lista:
          </p>

          {/* Botão Vincular Processo */}
          <div
            className='bg-gray-100 hover:bg-gray-200 text-sky-700 py-3 px-4 rounded-md flex items-center gap-1 justify-center cursor-pointer'
            onClick={openModal}
          >
            <IoAddCircle />
            <p className=' font-bold'>
              Vincular Exames
            </p>
          </div>
        </div>
        <hr />
      
        {/* Lista de Processos */}
        {riscosExames.length > 0 ? (
          <>
            <div className='w-full mt-1'>
              <h1 className='mb-2'>Exames Vinculados</h1>
              <div className='flex flex-wrap items-center gap-2'>
                {riscosExames.map((item) => (
                  <div key={item.id_exame}>
                    <div className='flex items-center bg-gray-100 rounded px-4 py-2 hover:bg-gray-200'>
                      <p className='font-bold text-sky-700 truncate'>
                        {item.nome_exame}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='w-full text-center text-lg text-sky-700 font-bold mt-4'>Nenhum exame vinculado ao risco</div>
          </>
        )}
      </div>

      <ModalSearchExamesRiscos
        isOpen={showModal}
        onCancel={closeModal}
        childId={childId}
      />
    </div>
  );
};


export default ModalRiscoExames;
