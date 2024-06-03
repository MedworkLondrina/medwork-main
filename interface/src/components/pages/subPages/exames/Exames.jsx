import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth';

import Back from '../../../layout/Back';
import SearchInput from '../components/SearchInput';
import FrmExames from './FrmExames';
import GridExames from './GridExames';

import { IoInformationCircleSharp } from "react-icons/io5";

function Exames() {

  const { getExames, loadSelectedCompanyFromLocalStorage } = useAuth(null);

  const [companyId, setCompanyId] = useState('');
  const [exames, setExames] = useState([]);
  const [filteredExames, setFilteredExames] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadCompany = async () => {
      const company = await loadSelectedCompanyFromLocalStorage();
      setCompanyId(company?.id_empresa);
    }

    loadCompany();
  }, []);

  const fetchExames = async () => {
    const data = await getExames();
    setExames(data);
  }

  useEffect(() => {
    fetchExames();
  }, [companyId]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  }

  useEffect(() => {
    const filtered = exames.filter((emp) => emp.nome_exame.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredExames(filtered);
  }, [searchTerm, exames]);

  return (
    <>

      {/* Popover */}
      <div className="flex w-full" onMouseLeave={() => setVisible(false)}>
        <div className="fixed z-50 m-2">
          <div className={`bg-gray-700 rounded-lg px-6 py-2 ${visible ? 'block' : 'hidden'} text-white`}>
            <h2 className="font-bold text-xl mb-2 text-gray-100 mt-2">Página Cadastro de Exame</h2>
            <div>
              <p className="mb-2 text-justify font-light text-gray-300 flex">
                A página de cadastro de exame foi meticulosamente desenvolvida para oferecer uma maneira eficaz de registrar e gerenciar informações essenciais sobre os exames.
              </p>
              <p className="mb-2 text-justify font-light text-gray-300 flex">
                No canto superior esquerdo da tela, um botão estrategicamente posicionado permite um retorno rápido à página principal de cadastros, garantindo uma navegação fluida e direta. No centro da tela, um formulário claro e de fácil compreensão está disponível para o cadastro do exame. Esse formulário segue o mesmo padrão intuitivo das demais páginas, tornando a inserção e modificação de dados uma tarefa simples. Abaixo do formulário, implementamos um campo de pesquisa para facilitar a localização rápida de exames específicos, proporcionando uma experiência eficiente ao usuário. Complementando a página, uma tabela organizada exibe os dados dos exames.
              </p>
              <p className="mb-2 text-justify font-light text-gray-300 flex">
                Essa abordagem visa oferecer uma página de cadastro de exames que atenda às necessidades dos usuários, proporcionando uma experiência intuitiva e eficiente na organização e gestão das informações.
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Cabeçalho */}
      <div className={`grid grid-cols-3 mb-1 mt-10`}>
        {/* Botão para voltar */}
        <div className="">
          <Link to="/cadastros">
            <Back />
          </Link>
        </div>
        <div className="flex justify-center">
          <h1 className="text-3xl font-extrabold text-sky-700">Cadastrar Exame</h1>
        </div>
        <div className="flex justify-end w-3/4 items-center">
          <div onMouseEnter={() => setVisible(true)}>
            <IoInformationCircleSharp className='text-sky-700' />
          </div>
        </div>
      </div>

      {/* Formulaário */}
      <FrmExames
        exames={exames}
        onEdit={onEdit}
        getExames={fetchExames}
      />

      {/* Barra de pesquisa */}
      <div className="flex justify-center w-full">
        <div className="w-3/6">
          <SearchInput onSearch={handleSearch} placeholder="Buscar Exame..." />
        </div>
      </div>

      {/* Tabela */}
      <GridExames
        exames={filteredExames}
        onEdit={setOnEdit}
      />
    </>
  );
}

export default Exames;