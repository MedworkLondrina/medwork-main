import React, { useEffect, useState } from 'react';
import { connect } from '../../../../../services/api';
import { IoAddCircle } from "react-icons/io5";
import { toast } from 'react-toastify';
import useAuth from '../../../../../hooks/useAuth';
import ModalSearchExames from './ModalSearchExames';

const ModalExame = ({ onCancel, isOpen, setorName, setorId , children}) => {

const {getExames} = useAuth();

  const [exames, setExames] = useState([]);
  const [examesFiltrados, setExamesFiltrados] = useState([]);
  const [showModal, setShowModal] = useState(false);

 
  

  const fetchExameFiltrado = async () => {
    try {
      const res = await getExames();
      setExames(res)
      setExamesFiltrados(children);
    } catch (error) {
      console.log("Erro ao buscar Exames!", error)
    }
  };

  useEffect(() => {
    fetchExameFiltrado();
  }, [isOpen]);


  const openModal = () => setShowModal(true);
  //Função para fechar o Modal
  const closeModal = () => setShowModal(false);

  const selectedSetor = async (item) => {
    try {

      const filteredSetorExames = examesFiltrados.filter((i) => i.id_exame === item);

      if (filteredSetorExames.length > 0) {
        toast.warn("Exame ja vinculado ao setor");
        return;
      };

      const response = await fetch(`${connect}/setores_Exames`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          id_exame: item,
          fk_setor_id: setorId
        }])
      });

      if (!response.ok) {
        throw new Error(`Erro ao vincular Exame ao setor. Status: ${response.status}`);
      }

      const responseData = await response.json();

      closeModal();
      toast.success(responseData);
    } catch (error) {
      toast.warn("Erro ao vincular Exame")
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
          <h1 className='text-xl font-bold text-sky-700'>Adicione Exames ao setor: <span className='text-xl text-gray-700 font-bold'>{setorName}</span></h1>
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
            Para vincular um Exame, clique no botão abaixo e selecione o Exame na lista:
          </p>

          {/* Botão Vincular Exame */}
          <div
            className='bg-gray-100 hover:bg-gray-200 text-sky-700 py-3 px-4 rounded-md flex items-center gap-1 justify-center cursor-pointer'
            onClick={openModal}
          >
            <IoAddCircle />
            <p className=' font-bold'>
              Vincular Exame
            </p>
          </div>
        </div>
        <hr />

        {/* Lista de Exames */}
        {examesFiltrados.length > 0 ? (
          <>
            <div className='w-full mt-1'>
              <h1 className='mb-2'>Exames Vinculados</h1>
              <div className='flex flex-wrap items-center gap-2'>
                {examesFiltrados.map((item) => (
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
            <div className='w-full text-center text-lg text-sky-700 font-bold mt-4'>Nenhum Exame vinculado ao setor</div>
          </>
        )}
      </div>
      <ModalSearchExames
        isOpen={showModal}
        onCancel={closeModal}
        children={children}
        setorName={setorName}
        setorId = {setorId}
        onSetorSelect={selectedSetor}
      />
    </div>
  );
};


export default ModalExame;
