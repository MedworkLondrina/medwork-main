import React, { useEffect, useState } from 'react';
import { connect } from '../../../../../services/api';
import { IoAddCircle } from "react-icons/io5";
import { toast } from 'react-toastify';
import useAuth from '../../../../../hooks/useAuth';

import ModalSearchProcesso from './ModalSearchProcesso'

const ModalProcesso = ({ onCancel, isOpen, setorName, setorId }) => {

  const { getProcessos, getSetoresProcessos } = useAuth();

  const [setorProcessos, setSetorProcessos] = useState([]);
  const [processos, setProcessos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchSetorProcesso = async () => {
    try {
      const res = await getSetoresProcessos();
      const filterBySector = res.filter((c) => c.fk_setor_id === setorId)
      console.log(res)
      setSetorProcessos(filterBySector);
    } catch (error) {
      console.log("Erro ao buscar setores e processos!", error)
    }
  };

  const fetchProcesso = async () => {
    try {
      const res = await getProcessos();
      setProcessos(res);
    } catch (error) {
      console.log("Erro ao buscar processos!", error)
    }
  };

  useEffect(() => {
    fetchSetorProcesso();
    fetchProcesso();
  }, [isOpen]);

  const findProcesso = (FkprocessoId) => {
    if (!processos) {
      return 'N/A'
    }

    const proc = processos.find((c) => c.id_processo === FkprocessoId)
    return proc ? proc.nome_processo : 'N/A'
  };

  //Funções do Modal
  //Função para abrir o Modal
  const openModal = () => setShowModal(true);
  //Função para fechar o Modal
  const closeModal = () => setShowModal(false);

  const selectedSetor = async (item) => {
    try {

      const filteredSetorProcessos = setorProcessos.filter((i) => i.fk_processo_id === item);

      if (filteredSetorProcessos.length > 0) {
        toast.warn("Processo ja vinculado ao setor");
        return;
      };

      const response = await fetch(`${connect}/setores_processos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          fk_processo_id: item,
          fk_setor_id: setorId
        }])
      });

      if (!response.ok) {
        throw new Error(`Erro ao vincular Processo ao setor. Status: ${response.status}`);
      }

      const responseData = await response.json();

      closeModal();
      fetchSetorProcesso();
      toast.success(responseData);
    } catch (error) {
      console.log("Erro ao vincular processo no setor", error);
      toast.warn("Erro ao vincular processo")
    }
  };

  if (!isOpen) {
    return null;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay absolute inset-0 backdrop-blur-[1px] bg-black bg-opacity-10" onClick={onCancel}></div>
      <div className="modal-container w-3/6 bg-white mx-auto rounded-xl z-50 overflow-y-auto px-8 py-4 max-h-[80vh]">
        <div className='flex justify-between items-center py-2'>
          <h1 className='text-xl font-bold text-sky-700'>Adicione processos ao setor: <span className='text-xl text-gray-700 font-bold'>{setorName}</span></h1>
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
            Para vincular um processo, clique no botão abaixo e selecione o processo na lista:
          </p>

          {/* Botão Vincular Processo */}
          <div
            className='bg-gray-100 hover:bg-gray-200 text-sky-700 py-3 px-4 rounded-md flex items-center gap-1 justify-center cursor-pointer'
            onClick={openModal}
          >
            <IoAddCircle />
            <p className=' font-bold'>
              Vincular Processo
            </p>
          </div>
        </div>
        <hr />

        {/* Lista de Processos */}
        {setorProcessos.length > 0 ? (
          <>
            <div className='w-full mt-1'>
              <h1 className='mb-2'>Processos Vinculados</h1>
              <div className='flex flex-wrap items-center gap-2'>
                {setorProcessos.map((item) => (
                  <div key={item.fk_processo_id}>
                    <div className='flex items-center bg-gray-100 rounded px-4 py-2 hover:bg-gray-200'>
                      <p className='font-bold text-sky-700 truncate'>
                        {findProcesso(item.fk_processo_id)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='w-full text-center text-lg text-sky-700 font-bold mt-4'>Nenhum processo vinculado ao setor</div>
          </>
        )}
      </div>
      <ModalSearchProcesso
        isOpen={showModal}
        onCancel={closeModal}
        children={processos}
        setorName={setorName}
        onSetorSelect={selectedSetor}
      />
    </div>
  );
};


export default ModalProcesso;
