import React, { useEffect, useState } from 'react';
import SearchInput from '../SearchInput';
import { connect } from '../../../../../services/api';
import useAuth from '../../../../../hooks/useAuth';
import { toast } from 'react-toastify';

const ModalSearchExames = ({ onCancel, isOpen, children,  setorId }) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [naoVinculados, setNaoVinculados] = useState([]);
  const {getExamesSemVinculo} = useAuth(null);

  const handleSearch = (term) => {
    setSearchTerm(term);
  }

  const handleNaovinculados = async () => {
    const naoVinculados = await getExamesSemVinculo(setorId);
    console.log(naoVinculados)
    setNaoVinculados(naoVinculados)
    return naoVinculados
  }

  useEffect(() => {
    handleNaovinculados();
  }, [])

  const findTipo = (admissional, periodico, retorno, mudanca, demissional) => {
    const tipos = [];

    if (admissional === 1) tipos.push('Admissional');
    if (periodico === 1) tipos.push('Periódico');
    if (retorno === 1) tipos.push('Retorno ao Trabalho');
    if (mudanca === 1) tipos.push('Mudança de Risco');
    if (demissional === 1) tipos.push('Demissional');

    return tipos.join(', ');
  };

  const handleItemClick = async (item) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
    const tenant = userData.tenant_code;
    const nome = userData.nome_usuario;
    const queryParams = new URLSearchParams({ tenant_code: tenant, nome_usuario: nome }).toString();
      const response = await fetch(`${connect}/setor_exame?${queryParams}`,  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          setorId: setorId,
          exameId: item.id_exame, 
        }),
      });
      
      if (response.ok) {
        handleNaovinculados();
        toast.success(response.message);
      } else {
        console.error('Falha ao vincular exame ao setor.');
      }
    } catch (error) {
      console.error('Erro ao enviar requisição POST:', error);
    }
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
          {naoVinculados.length > 0 ? (
            <>
              {naoVinculados.map((item, i) => (
                <li
                  key={i}
                  className="py-3 hover:bg-gray-100 hover:shadow-sm shadow-sm bg-gray-50 cursor-pointer px-4 rounded-md"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-center gap-12">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-700">
                        {item.nome_exame}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900">
                      {item.periodicidade_exame}
                    </div>
                  </div>
                  <p className='text-sm text-gray-600'>{findTipo(item.admissional, item.periodico, item.retorno, item.mudanca, item.demissional)}</p>
                </li>
              ))}
            </>
          ) : (
            <li className='py-3 hover:bg-gray-100 hover:shadow-sm shadow-sm bg-gray-50 cursor-pointer px-4 rounded-md'>
              <p>Nenhum exame encontrado</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ModalSearchExames;
