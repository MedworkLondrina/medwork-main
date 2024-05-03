import React, { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import FrmCadastroUsuario from './frmCadastroUsuario';
import GridUsuarios from './gridUsuarios';
import { Link } from "react-router-dom";
import Back from '../../../layout/Back';
import { IoInformationCircleSharp } from "react-icons/io5";
import SearchInput from "../components/SearchInput";

function CadastroUsuario() {
  const { handleSetCompanyId, companyId, getUsuarios, usuarios } = useAuth(null);

  const [onEdit, setOnEdit] = useState(null);
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('nome'); // Adicionei um estado para rastrear o tipo de busca (por nome ou CPF)
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [filterOption, setFilterOption] = useState('Nome');

  useEffect(() => {
    handleSetCompanyId();
    getUsuarios();
  }, [companyId]);

  const handleEdit = (selectedUser) => {
    setOnEdit(selectedUser);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
  };
  const handleFilterOptionChange = (option) => {
    setFilterOption(option);
    if (option === 'Nome') {
      setSearchType('nome');
    } else if (option === 'cpf_usuario') {
      setSearchType('cpf');
    }
  };
  

  useEffect(() => {
    try {
      let filtered = [];
      if (searchType === 'nome') {
        filtered = usuarios.filter((user) => user.nome_usuario.toLowerCase().includes(searchTerm.toLocaleLowerCase()));
      } else if (searchType === 'cpf') {
        filtered = usuarios.filter((user) => user.cpf_usuario.toLowerCase().includes(searchTerm.toLocaleLowerCase()));
      }
      setFilteredUsuarios(filtered);
    } catch (error) {
      console.log("Erro ao filtrar usuários!", error);
    }
  }, [searchTerm, searchType, usuarios]);
  
  return (
    <>
      <div className="tab-content">
        {/* Popover */}
        {/* Cabeçalho */}
        {/* Formulário, Tabela e Barra de Pesquisa */}
        <div>
          <FrmCadastroUsuario
            onEdit={onEdit}
            setOnEdit={setOnEdit}
            getUsuario={getUsuarios}
            usuarios={usuarios}
          />

<div className="flex justify-center w-full mb-4">
  <div className="w-3/6">
    <SearchInput onSearch={handleSearch} placeholder="Buscar Usuário..." />
  </div>
</div>


          <div className='flex w-full justify-center mt-1'>
            <div className='w-1/2 flex flex-col justify-center'>
              <h3 className="text-sm font-medium text-gray-700">Filtros</h3>
              <ul className="items-center w-full text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded sm:flex">
                <li className={`w-full border-b border-gray-200 sm:border-b-0 sm:border-r cursor-pointer ${filterOption === 'Nome' ? 'bg-gray-100' : ''}`} onClick={() => handleFilterOptionChange('Nome')}>
                  <div className="flex items-center py-2 px-2 gap-1 cursor-pointer">
                    <input id="Nome" type="radio" value="Nome" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer" checked={filterOption === 'Nome'} onChange={() => handleFilterOptionChange('Nome')} />
                    <label htmlFor="Nome" className="w-full text-sm font-medium text-gray-900 cursor-pointer">Nome</label>
                  </div>
                </li>
                <li className={`w-full cursor-pointer ${filterOption === 'cpf_usuario' ? 'bg-gray-100' : ''}`} onClick={() => handleFilterOptionChange('cpf_usuario')}>
                  <div className="flex items-center py-2 px-2 gap-1 cursor-pointer">
                    <input id="descricao" type="radio" value="cpf_usuario" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer" checked={filterOption === 'cpf_usuario'} onChange={() => handleFilterOptionChange('cpf_usuario')} />
                    <label htmlFor="cpf_usuario" className="w-full text-sm font-medium text-gray-900 cursor-pointer">CPF</label>
                  </div>
                </li>
              </ul>
            </div>
          </div>


          <GridUsuarios
            usuario={filteredUsuarios}
            setFilteredUsuarios={setFilteredUsuarios}
            setOnEdit={handleEdit}
          />
        </div>
      </div>
    </>
  )
}

export default CadastroUsuario;
