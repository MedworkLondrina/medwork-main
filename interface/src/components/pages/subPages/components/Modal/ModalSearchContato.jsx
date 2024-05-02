import React, { useEffect, useState } from 'react';
import { IoAddCircle, IoSearchCircle } from "react-icons/io5";

import FrmContato from '../../contato/frmCadastroContato';
import SearchInput from '../SearchInput';

const ModalSearchEmpresa = ({ onCancel, isOpen, children, onContactSelect, contact }) => {

  const [showForm, setShowForm] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChildren, setFilteredChildren] = useState([]);

  useEffect(() => {
    if (children && children.length > 0) {
      setShowForm(false);

      try {
        const filtred = children.filter((ctt) => ctt.nome_contato.toLowerCase().includes(searchTerm.toLocaleLowerCase()));
        setFilteredChildren(filtred);
      } catch (error) {
        console.error(`Erro ao burscar contatos. Status: ${error}`)
      }

    };

    if (contact) {
      setShowForm(true);
    };

  }, [children, searchTerm, contact]);

  const handleSearch = (term) => {
    setSearchTerm(term)
  };

  if (!isOpen) {
    return null;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay absolute inset-0 backdrop-blur-[1px] bg-black bg-opacity-10" onClick={onCancel}></div>
      <div className="modal-container md:w-4/12 bg-white mx-auto rounded-xl z-50 overflow-y-auto px-8 py-4 max-h-[80vh]">
        <div className='flex justify-between items-center py-2'>
          <h1 className='text-xl font-bold text-sky-800'>{children ? 'Selecione' : 'Cadastre'} um contato</h1>
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
        <div className='flex justify-center items-center py-2'>
          <p className='text-sm text-gray-500 text-center'>
            {children ? 'Selecione' : 'Cadastre'} um Contato para ser o responsável pela Empresa. Esse contato saira como responsável da empresa nos laudos.
          </p>
        </div>

        {/* Formulário */}
        {showForm ? (
          <>
            {children && children.length > 0 && (
              <>
                {/* Buscar Contato */}
                <div className='w-full'>
                  <div className='bg-gray-100 hover:bg-gray-200 text-sky-700 text-sm font-bold py-2 px-4 rounded flex justify-center items-center gap-1 cursor-pointer' onClick={() => setShowForm(false)}>
                    <IoSearchCircle />
                    <p>Buscar Contato</p>
                  </div>
                </div>
              </>
            )}
            <FrmContato
              setContatoData={onContactSelect}
              contact={contact}
            />
          </>
        ) : (
          <>
            {/* Adicionar Contato */}
            <div className='w-full'>
              <div className='bg-gray-100 hover:bg-gray-200 text-sky-700 text-sm font-bold py-2 px-4 rounded flex justify-center items-center gap-1 cursor-pointer' onClick={() => setShowForm(true)}>
                <IoAddCircle />
                <p>Adicionar Contato</p>
              </div>
            </div>
          </>
        )}

        {children && children.length > 0 && !showForm && (
          <>
            {/* Barra de Pesquisa */}
            <div className="flex justify-center w-full mt-4 mb-4">
              <div className="w-5/6">
                <SearchInput onSearch={handleSearch} placeholder="Buscar Contatos..." />
              </div>
            </div>

            {/* Lista de Contatos */}
            <div className='mt-4'>
              <ul className='space-y-2'>
                {filteredChildren.map((child) => (
                  <li key={child.id_contato} onClick={() => onContactSelect(child)}>
                    <div className='bg-gray-100 rounded px-4 py-2 hover:bg-gray-200 cursor-pointer'>
                      <p className='text-sky-700 font-semibold'>{child.nome_contato}</p>
                      <div className='flex items-center gap-1'>
                        <p className='text-xs font-light text-gray-700'>Telefone:</p>
                        <p className='text-sm'>{child.telefone_contato}</p>
                      </div>
                      <div className='flex items-center gap-1'>
                        <p className='text-xs font-light text-gray-700'>Email:</p>
                        <p className='text-sm'>{child.email_contato}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default ModalSearchEmpresa;
