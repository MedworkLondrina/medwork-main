import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from '../../../../hooks/useAuth'

//Importando Componentes
import FrmCadastroUnidade from "./frmCadastroUnidade";
import GridCadastroUnidade from './gridCadastroUnidade';
import SearchInput from "../components/SearchInput";
import Back from '../../../layout/Back'
import { IoInformationCircleSharp } from "react-icons/io5";

function CadastroUnidade() {

  const {
    fetchUnidades,
    loadSelectedCompanyFromLocalStorage,
    companyId,
    fetchContatos,
  } = useAuth(null)

  // Instanciando variáveis e definindo como vazio
  const [onEdit, setOnEdit] = useState(null);
  const [visible, setVisible] = useState(false);

  //Instanciando o Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUnidade, setFilteredUnidades] = useState([]);

  const [unidades, setUnidades] = useState([]);
  const [contatos, setContatos] = useState([]);

  useEffect(() => {
    loadSelectedCompanyFromLocalStorage();
  }, []);

  const get = async () => {
    const units = await fetchUnidades();
    console.log(units);
    setUnidades(units);
  };

  const getContatos = async () => {
    const data = await fetchContatos(companyId);
    setContatos(data);
  };

  useEffect(() => {
    get();
    getContatos();
  }, [companyId]);

  //Função para Editar
  const handleEdit = (selectUnidade) => {
    setOnEdit(selectUnidade);
  };

  //Função para Pesquisa
  useEffect(() => {
    try {
      const filtred = unidades.filter((udd) => udd.nome_unidade.toLowerCase().includes(searchTerm.toLocaleLowerCase()));
      setFilteredUnidades(filtred);
    } catch (error) {
      console.log("Erro ao filtrar unidades!", error)
    }
  }, [searchTerm, unidades]);

  const handleSearch = (term) => {
    setSearchTerm(term)
  };


  return (
    <div className="tab-content mb-10">

      {/* Popover */}
      <div className="flex w-full" onMouseLeave={() => setVisible(false)}>
        <div className="fixed z-50 m-2">
          <div className={`bg-gray-700 rounded-lg px-6 py-2 ${visible ? 'block' : 'hidden'} text-white`}>
            <h2 className="font-bold text-xl mb-2 text-gray-100 mt-2">Página Cadastro Unidade</h2>
            <div>
              <p className="mb-2 text-justify font-light text-gray-300 flex">
                A página de cadastro de unidades foi meticulosamente projetada para oferecer uma forma eficiente e organizada de registrar informações essenciais relacionadas às unidades vinculadas a empresa.
              </p>
              <p className="mb-2 text-justify font-light text-gray-300 flex">
                No canto superior esquerdo da tela, destaca-se um botão que proporciona a facilidade de retorno à página principal de cadastro, esse recurso visa garantir uma navegação ágil e intuitiva para os usuários. No centro da tela, apresentamos um formulário claro e de fácil compreensão para o cadastro de unidades. Esse formulário segue o mesmo padrão intuitivo das demais páginas, facilitando a inserção e a modificação de dados relativos às unidades no sistema, o campo cep preenche automaticamente os campos de endereço, bairro, cidade e estado. Abaixo do formulário, implementamos um campo de pesquisa para facilitar a localização rápida de unidades específicas. Esse recurso busca otimizar a experiência do usuário, permitindo que encontrem informações de maneira eficiente. Além disso, apresentamos uma tabela organizada abaixo do campo de pesquisa, contendo os dados da unidade, como unidade, cnpj, endereço, responsável e empresa. Em uma coluna dedicada, são disponibilizados dois botões distintos para cada setor: um ícone de lápis para edição e um checkbox para desativar o setor. O botão de edição permite ajustar informações diretamente na tabela, já o checkbox ativa ou inativa uma unidade na empresa.
              </p>
              <p className="mb-2 text-justify font-light text-gray-300 flex">
                Com essa abordagem, buscamos fornecer uma página de cadastro que atenda às necessidades dos usuários, oferecendo uma experiência intuitiva, eficiente e completa para a gestão e organização das informações relacionadas as unidades da empresa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cabeçalho */}
      <div className="grid grid-cols-3 mb-10 mt-10">
        {/* Botão para voltar */}
        <div className="">
          <Link to="/cadastros">
            <Back />
          </Link>
        </div>
        <div className="flex justify-center">
          <h1 className="text-3xl font-extrabold text-sky-700">Cadastrar Unidade</h1>
        </div>
        <div className="flex justify-end w-3/4 items-center">
          <div onMouseEnter={() => setVisible(true)}>
            <IoInformationCircleSharp className='text-sky-700' />
          </div>
        </div>
      </div>

      {/* Formulário de Cadastro */}
      <FrmCadastroUnidade
        onEdit={onEdit}
        setOnEdit={setOnEdit}
        getUnidades={get}
        getContatos={getContatos}
        contato={contatos}
        companyId={companyId}
      />

      {/* Barra de Pesquisa */}
      <div className="flex justify-center w-full">
        <div className="w-3/6">
          <SearchInput onSearch={handleSearch} placeholder="Buscar Unidade..." />
        </div>
      </div>

      {/* Tabela Unidade */}
      <GridCadastroUnidade
        unidade={filteredUnidade}
        setUnidades={setUnidades}
        getUnidades={get}
        setOnEdit={handleEdit}
        contato={contatos}
      />
    </div>
  )
}

export default CadastroUnidade;
