import React, { useEffect, useState } from 'react';
import SearchInput from '../SearchInput';

import useAuth from '../../../../../hooks/useAuth';

import { IoIosCloseCircleOutline } from "react-icons/io";

const ModalSearchCnae = ({ onCancel, isOpen, processo, onSelect, selectedCnaes }) => {

  const { fetchCnae } = useAuth([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cnae, setCnae] = useState([]);
  const [filteredCnae, setFilteredCnae] = useState([]);
  const [cnaeList, setCnaeList] = useState([]);
  const [filterOption, setFilterOption] = useState('codigo');

  useEffect(() => {
    if (selectedCnaes) {
      setCnaeList(selectedCnaes);
    }
    if (!isOpen) {
      setSearchTerm('');
    }
    get();
  }, [isOpen]);

  const get = async () => {
    const response = await fetchCnae();
    setCnae(response);
  };

  // Função para pesquisa de CNAE
  useEffect(() => {
    const filtered = cnae.filter((item) => {
      const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
      const normalizedSearchTerm = normalizeString(searchTerm);

      const normalizedSubclasseCnae = normalizeString(item.subclasse_cnae);
      const normalizedDescricaoCnae = normalizeString(item.descricao_cnae);

      return (
        normalizedSubclasseCnae.includes(normalizedSearchTerm) ||
        normalizedDescricaoCnae.includes(normalizedSearchTerm)
      );
    });

    setFilteredCnae(filtered);
  }, [searchTerm, cnae]);

  const handleSearch = (term) => {
    let search;
    if (filterOption === 'codigo') {
      const numericOnly = term.replace(/\D/g, '');
      if (numericOnly.length <= 5) {
        search = numericOnly.replace(/(\d{4})(\d{1})/, '$1-$2');
      } else {
        search = numericOnly.replace(/(\d{4})(\d{1})(\d{2})/, '$1-$2/$3');
      }
    } else {
      search = term
    }
    setSearchTerm(search);
  };

  const selectCnae = (item) => {
    const list = [...cnaeList, item];
    setCnaeList(list);
  };

  const handleClearCnae = () => {
    setCnaeList([]);
    get();
  };

  const handleConfirmSelectedCnaes = () => {
    onCancel();
    onSelect(cnaeList);
  };

  const removeCnaeList = (item) => {
    const updatedList = cnaeList.filter((cnae) => cnae !== item);
    setCnaeList(updatedList);
  };

  useEffect(() => {
    get();
    const updatedCnaeList = cnae.filter(item => !cnaeList.some(selectedItem => selectedItem.id_cnae === item.id_cnae));
    setCnae(updatedCnaeList);
  }, [cnaeList]);

  const handleFilterOptionChange = (option) => {
    setSearchTerm('');
    setFilterOption(option);
  };

  if (!isOpen) {
    return null;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay absolute inset-0 backdrop-blur-[1px] bg-black bg-opacity-10" onClick={handleConfirmSelectedCnaes}></div>
      <div className="modal-container md:w-4/12 bg-white mx-auto rounded-xl z-50 overflow-y-auto px-8 py-4 max-h-[80vh]">
        <div className='flex justify-between items-center py-2'>
          <h1 className='text-xl font-bold text-sky-800'>Selecione os CNAE's</h1>
          <div className="flex justify-end">
            {/* Botão Fechar */}
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8"
              onClick={handleConfirmSelectedCnaes}>
              <svg className="flex m-auto w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>
        </div>
        <div className='border-b border-gray-200'></div>
        {processo && (
          <div className='flex justify-center items-center py-2'>
            <p className='text-sm text-gray-500 text-center'>
              {/* melhorar o texto */}
              Escolhe os CNAE's para vincular ao processo.
            </p>
          </div>
        )}

        {/* Cnaes Selecionados */}
        {cnaeList.length > 0 ? (
          <>
            <div className='mb-6'>
              <h1 className='font-medium text-sky-700 mb-2'>Cnae's Selecionados:</h1>
              {/* Cnaes */}
              <div className='grid grid-cols-5 mb-4 items-center'>
                {cnaeList.map((item, i) => (
                  <>
                    <div key={i} className="col-span-1 bg-gray-100 rounded px-2 py-2 m-1" onClick={removeCnaeList.bind(this, item)}>
                      <p className='text-xs font-medium text-gray-700 text-center cursor-pointer'>{item.subclasse_cnae}</p>
                    </div>
                    <p className='text-gray-600 hover:text-gray-900 cursor-pointer'>
                      <IoIosCloseCircleOutline onClick={removeCnaeList.bind(this, item)} />
                    </p>
                  </>
                ))}
              </div>

              {/* Botoes */}
              <div className='flex justify-end gap-2'>

                {/* Limpar */}
                <button
                  className='bg-red-600 rounded font-semibold text-white px-3 py-2 hover:bg-red-700'
                  type='button'
                  onClick={handleClearCnae}
                >
                  Limpar
                </button>

                {/* Confirmar */}
                <button
                  className='bg-green-600 rounded font-semibold text-white px-3 py-2 hover:bg-green-700'
                  type='button'
                  onClick={handleConfirmSelectedCnaes}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </>
        ) : (null)}

        {/* Search */}
        <div className='w-full mt-2 mb-6'>
          <div className="flex justify-center w-full">
            <div className="w-5/6">
              <SearchInput onSearch={handleSearch} term={searchTerm} placeholder="Buscar Cnae..." />
            </div>
          </div>

          <div className='flex w-full justify-center mt-1'>
            <div className='w-1/2 flex flex-col justify-center'>
              <h3 className="text-sm font-medium text-gray-700">Filtros</h3>
              <ul className="items-center w-full text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded sm:flex">
                <li className={`w-full border-b border-gray-200 sm:border-b-0 sm:border-r cursor-pointer ${filterOption === 'codigo' ? 'bg-gray-100' : ''}`} onClick={() => handleFilterOptionChange('codigo')}>
                  <div className="flex items-center py-2 px-2 gap-1 cursor-pointer">
                    <input id="codigo" type="radio" value="codigo" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer" checked={filterOption === 'codigo'} onChange={() => handleFilterOptionChange('codigo')} />
                    <label htmlFor="codigo" className="w-full text-sm font-medium text-gray-900 cursor-pointer">Código</label>
                  </div>
                </li>
                <li className={`w-full cursor-pointer ${filterOption === 'descricao' ? 'bg-gray-100' : ''}`} onClick={() => handleFilterOptionChange('descricao')}>
                  <div className="flex items-center py-2 px-2 gap-1 cursor-pointer">
                    <input id="descricao" type="radio" value="descricao" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer" checked={filterOption === 'descricao'} onChange={() => handleFilterOptionChange('descricao')} />
                    <label htmlFor="descricao" className="w-full text-sm font-medium text-gray-900 cursor-pointer">Descrição</label>
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Lista */}
        {filteredCnae.length > 0 ? (
          <>
            <ul className='space-y-3'>
              {filteredCnae
                .filter((item) =>
                  !cnaeList.some((selectedItem) => selectedItem.id_cnae === item.id_cnae)
                )
                .map((item, i) => (
                  <li
                    key={i}
                    className="py-3 hover:bg-gray-100 hover:shadow-sm shadow-sm bg-gray-50 cursor-pointer px-4 rounded-md"
                    onClick={selectCnae.bind(this, item)}
                  >
                    <div className='grid grid-cols-12'>
                      <div className="col-span-11">
                        <p className="text-lg font-bold text-sky-700">
                          {item.subclasse_cnae}
                        </p>
                      </div>
                      <div className='col-span-1 flex justify-end'>
                        <p className='text-lg font-bold text-sky-700'>
                          {item.grau_risco_cnae}
                        </p>
                      </div>
                    </div>
                    <div className='border-gray-200 border-b mb-2'></div>
                    <div className=''>
                      <p className="text-gray-700 text-sm font-light">Descrição:</p>
                      <p className='text-gray-700'>{item.descricao_cnae}</p>
                    </div>
                  </li>
                ))}
            </ul>
          </>
        ) : (
          <>
            <div className='flex w-full bg-gray-100 rounded px-4 py-2 justify-center'>
              <p className='text-center text-sm text-gray-800'>Nenhum CNAE encontrado com o filtro: <span className='text-center text-sm font-semibold text-red-800'>{searchTerm}</span></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default ModalSearchCnae;
