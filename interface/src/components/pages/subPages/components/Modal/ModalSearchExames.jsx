import React, { useEffect, useState } from 'react';
import SearchInput from '../SearchInput';

const ModalSearchExames = ({ onCancel, isOpen, children, onSelect }) => {

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const findTipo = (admissional, periodico, retorno, mudanca, demissional) => {
    const tipos = [];

    if (admissional === 1) tipos.push('Admissional');
    if (periodico === 1) tipos.push('Periódico');
    if (retorno === 1) tipos.push('Retorno ao Trabalho');
    if (mudanca === 1) tipos.push('Mudança de Risco');
    if (demissional === 1) tipos.push('Demissional');

    return tipos.join(', ');
  };

  if (!isOpen) {
    return null;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay absolute inset-0 backdrop-blur-[1px] bg-black bg-opacity-10" onClick={onCancel}></div>
      <div className="modal-container w-2/6 bg-white mx-auto rounded-xl z-50 overflow-y-auto px-8 py-4 max-h-[80vh]">
        <div className='flex justify-between items-center py-2'>
          <h1 className='text-xl font-bold text-sky-800'>Selecione um Exame</h1>
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
        </div>
        <div className="flex justify-center w-full mt-2 mb-2">
          <div className="w-5/6">
            <SearchInput onSearch={handleSearch} placeholder="Buscar Exame..." />
          </div>
        </div>
        <ul className='space-y-3 py-3'>
          {children.length > 0 ? (
            <>
              {children.filter((children) =>
                children.nome_exame.toLowerCase().includes(searchTerm.toLowerCase())
              )
                .map((children, i) => (
                  <li
                    key={i}
                    className="py-3 hover:bg-gray-100 hover:shadow-sm shadow-sm bg-gray-50 cursor-pointer px-4 rounded-md"
                    onClick={() => onSelect(children)}
                  >
                    <div className="flex items-center gap-12">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-700">
                          {children.nome_exame}
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900">
                        {children.periodicidade_exame}
                      </div>
                    </div>
                    <p className='text-sm text-gray-600'>{findTipo(children.admissional, children.periodico, children.retorno, children.mudanca, children.demissional)}</p>
                  </li>
                ))}

            </>
          ) : (
            <>
              <li className='py-3 hover:bg-gray-100 hover:shadow-sm shadow-sm bg-gray-50 cursor-pointer px-4 rounded-md'>
                <p>Nenhum exame encontrado</p>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};


export default ModalSearchExames;
