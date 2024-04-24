import React, { useEffect, useState } from 'react';
import SearchInput from '../SearchInput';

import useAuth from '../../../../../hooks/useAuth';

const ModalSearchCnae = ({ onCancel, isOpen, processoNome, onSelect }) => {

  const { fetchCnae } = useAuth([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cnae, setCnae] = useState([]);
  const [filteredCnae, setFilteredCnae] = useState([]);
  const [cnaeList, setCnaeList] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const get = async () => {
    const response = await fetchCnae();
    setCnae(response);
  };

  useEffect(() => {
    get();
  }, [isOpen]);

  const handleSearch = (term) => {
    setSearchTerm(term);
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

  useEffect(() => {
    const filtered = cnae.filter((cnae) => {
      const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
      const normalizedSearchTerm = normalizeString(searchTerm);

      return (
        normalizeString(cnae.subclasse_cnae).includes(normalizedSearchTerm) ||
        normalizeString(cnae.descricao_cnae).includes(normalizedSearchTerm)
      );
    });

    setFilteredCnae(filtered);
  }, [searchTerm, cnae]);


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
        <div className='flex justify-center items-center py-2'>
          <p className='text-sm text-gray-500 text-center'>
            {/* melhorar o texto */}
            Escolhe os CNAE's para vincular ao processo.
          </p>
        </div>

        {/* Cnaes Selecionados */}
        {cnaeList.length > 0 ? (
          <>
            <div className='mb-6'>
              <h1 className='font-medium text-sky-700 mb-2'>Cnae's Selecionados:</h1>
              {/* Cnaes */}
              <div className='grid grid-cols-5 mb-4'>
                {cnaeList.map((item, i) => (
                  <div key={i} className="col-span-1 bg-gray-100 rounded px-2 py-2 m-1" onClick={removeCnaeList.bind(this, item)}>
                    <p className='text-xs font-medium text-gray-700 text-center cursor-pointer'>{item.subclasse_cnae}</p>
                  </div>
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
        <div className="flex justify-center w-full mt-2 mb-6">
          <div className="w-5/6">
            <SearchInput onSearch={handleSearch} placeholder="Buscar Cnae..." />
          </div>
        </div>

        {/* Lista */}
        {cnae ? (
          <>
            <ul className='space-y-3'>
              {cnae
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
            <div>Carregando...</div>
          </>
        )}
      </div>
    </div>
  );
};


export default ModalSearchCnae;
