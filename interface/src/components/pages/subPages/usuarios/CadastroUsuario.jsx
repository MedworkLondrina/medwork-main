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
  const [searchType, setSearchType] = useState('nome');
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
        <div className="flex w-full" onMouseLeave={() => setVisible(false)}>
          <div className="fixed z-50 m-2">
            <div className={`bg-gray-700 rounded-lg px-6 py-2 ${visible ? 'block' : 'hidden'} text-white`}>
              <h2 className="font-bold text-xl mb-2 text-gray-100 mt-2">Página Cadastro Usuário</h2>
              <div>
                <p className="mb-2 text-justify font-light text-gray-300 flex">
                  A página de cadastro de usuários foi meticulosamente projetada para oferecer uma forma eficiente e organizada de cadastrar usuários para utilizar o sistema.
                </p>
                <p className="mb-2 text-justify font-light text-gray-300 flex">
                  No canto superior esquerdo da tela, destaca-se um botão que proporciona a facilidade de retorno à página principal de gestão, esse recurso visa garantir uma navegação ágil e intuitiva para os usuários. No centro da tela, apresentamos um formulário claro e de fácil compreensão. Esse formulário segue o mesmo padrão intuitivo das demais páginas, facilitando a inserção e a modificação de dados, o campo de permissão define quais acessos o usuário recebera no sistema. Abaixo do formulário, implementamos um campo de pesquisa para facilitar a localização rápida de usuários específicos. Esse recurso busca otimizar a experiência do usuário, permitindo que encontrem informações de maneira eficiente. Além disso, apresentamos uma tabela organizada abaixo do campo de pesquisa, contendo os dados do usuário, como nome, cpf, email e permissão. Em uma coluna dedicada, é disponibilizado um botão para edição dos dados: um ícone de lápis. O botão de edição permite ajustar informações diretamente na tabela.
                </p>
                <p className="mb-2 text-justify font-light text-gray-300 flex">
                  Com essa abordagem, buscamos fornecer uma página de cadastro que atenda às necessidades dos usuários, oferecendo uma experiência intuitiva, eficiente e completa para a gestão e organização das informações.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cabeçalho */}
        <div className="grid grid-cols-3 mb-10 mt-10">
          {/* Botão para voltar */}
          <div className="">
            <Link to="/gestao">
              <Back />
            </Link>
          </div>
          <div className="flex justify-center">
            <h1 className="text-3xl font-extrabold text-sky-700">Cadastrar Usuário</h1>
          </div>
          <div className="flex justify-end w-3/4 items-center">
            <div onMouseEnter={() => setVisible(true)}>
              <IoInformationCircleSharp className='text-sky-700' />
            </div>
          </div>
        </div>

        {/* Formulário, Tabela e Barra de Pesquisa */}
        <div>
          <FrmCadastroUsuario
            onEdit={onEdit}
            setOnEdit={setOnEdit}
            getUsuario={getUsuarios}
            usuarios={usuarios}
          />

          {/* Barra de Pesquisa */}
          <div className="flex justify-center w-full mb-2">
            <div className="w-3/6">
              <SearchInput onSearch={handleSearch} placeholder="Buscar Usuário..." />
            </div>
          </div>

          {/* Filtros */}
          <div className='flex w-full justify-center mb-6'>
            <div className='w-1/3 flex flex-col justify-center'>
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
