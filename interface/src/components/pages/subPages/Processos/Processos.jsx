import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Back from '../../../layout/Back';
import SearchInput from '../components/SearchInput';
import FrmProcessos from './frmProcessos';
import GridProcesso from './GridProcessos';
import useAuth from '../../../../hooks/useAuth';
import { IoInformationCircleSharp } from "react-icons/io5";
import { BsFillPencilFill } from 'react-icons/bs';
import { IoCloseCircleOutline } from "react-icons/io5";

function Processos() {

  const [onEdit, setOnEdit] = useState(null);

  const { getProcessos, handleSetCompanyId, companyId, fetchProcessoCnae, fetchCnae } = useAuth(null);

  //Instanciando o Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProcessos, setFilteredProcessos] = useState([]);
  const [visible, setVisible] = useState(false);
  const [processos, setProcessos] = useState([]);
  const [processoCnae, setProcessoCnae] = useState([]);
  const [cnae, setCnae] = useState([]);
  const [verify, setVerify] = useState([]);
  const [verifyCnaes, setVerifyCnaes] = useState([]);
  const [verifyVinculo, setVerifyVinculo] = useState(false);

  useEffect(() => {
    handleSetCompanyId();
  }, [])

  const get = async () => {
    const proc = await getProcessos();
    setProcessos(proc);
  };

  useEffect(() => {
    get();
  }, [companyId])

  const handleEdit = (selectedProcesso) => {
    setOnEdit(selectedProcesso);
    handleClearVerify();
  }

  // Função para pesquisa
  useEffect(() => {
    const filtered = processos.filter((proc) => {
      const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
      const normalizedSearchTerm = normalizeString(searchTerm);

      return (
        normalizeString(proc.nome_processo).includes(normalizedSearchTerm)
      );
    });

    setFilteredProcessos(filtered);
  }, [searchTerm, processos]);


  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleClearVerify = () => {
    setVerify([]);
    setVerifyCnaes([]);
    setVerifyVinculo(false);
  };

  return (
    <div className="tab-content">

      {/* Popover */}
      <div className="flex w-full" onMouseLeave={() => setVisible(false)}>
        <div className="fixed z-50 m-2">
          <div className={`bg-gray-700 rounded-lg px-6 py-2 ${visible ? 'block' : 'hidden'} text-white`}>
            <h2 className="font-bold text-xl mb-2 text-gray-100 mt-2">Página Cadastro Processo</h2>
            <div>
              <p className="mb-2 text-justify font-light text-gray-300 flex">
                A página de cadastro de processo foi meticulosamente desenvolvida para oferecer uma maneira eficaz de registrar e gerenciar informações essenciais sobre os processos.
              </p>
              <p className="mb-2 text-justify font-light text-gray-300 flex">
                No canto superior esquerdo da tela, um botão estrategicamente posicionado permite um retorno rápido à página principal de cadastros, garantindo uma navegação fluida e direta. No centro da tela, um formulário claro e de fácil compreensão está disponível para o cadastro do processo. Esse formulário segue o mesmo padrão intuitivo das demais páginas, tornando a inserção e modificação de dados uma tarefa simples. Abaixo do formulário, implementamos um campo de pesquisa para facilitar a localização rápida de processos específicos, proporcionando uma experiência eficiente ao usuário. Complementando a página, uma tabela organizada exibe os dados dos processos. Nessa tabela, são apresentados dois botões distintos para cada processo: um ícone de lápis para edição e um botão de vinculação para associar riscos ao processo selecionado. Ao clicar no botão de vinculação, os usuários podem abrir um modal dedicado para vincular riscos específicos ao processo, permitindo uma gestão integrada e eficaz dessas informações.
              </p>
              <p className="mb-2 text-justify font-light text-gray-300 flex">
                Essa abordagem visa oferecer uma página de cadastro de processos que atenda às necessidades dos usuários, proporcionando uma experiência intuitiva e eficiente na organização e gestão das informações relacionadas aos processos de trabalho.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Verify */}
      {(verify.length > 0 && !onEdit) && (
        <div className="flex w-full">
          <div className="w-full z-40 m-2 bg-yellow-100 shadow-sm rounded-lg px-6 py-3">
            <div className='flex justify-between'>
              <div className='flex items-center gap-2'>
                <h2 className="text-lg text-gray-500">Processo: <span className='text-lg font-medium text-gray-600'>{verify[0].nome_processo.toUpperCase()}</span> já cadastrado</h2>
                {verifyCnaes.length === 0 && (
                  <div className="text-sky-500 hover:text-sky-600 text-xs cursor-pointer" onClick={() => handleEdit(verify[0])}>
                    <BsFillPencilFill />
                  </div>
                )}
              </div>
              <div className='text-end text-gray-500 hover:text-gray-700 rounded-md p-1 flex items-center cursor-pointer' onClick={handleClearVerify}>
                <IoCloseCircleOutline />
              </div>
            </div>
            {verifyCnaes.length > 0 && (
              <>
                <p className='text-gray-500 text-sm'>CNAE's vinculados:</p>
                <div className='grid grid-cols-12 items-center'>
                  {verifyCnaes.map((item, i) => (
                    <div key={i} className="col-span-1 shadow rounded px-2 py-2 m-1">
                      <p className='text-xs font-medium text-gray-500 text-center cursor-pointer'>{item.subclasse_cnae}</p>
                    </div>
                  ))}
                  <div className="col-span-1 text-sky-500 hover:text-sky-600 m-1 px-2 text-sm cursor-pointer" onClick={() => handleEdit(verify[0])}>
                    <BsFillPencilFill />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <div className={`grid grid-cols-3 mb-10 ${verify.length > 0 ? 'mt-5' : 'mt-10'}`}>
        {/* Botão para voltar */}
        <div className="">
          <Link to="/cadastros">
            <Back />
          </Link>
        </div>
        <div className="flex justify-center">
          <h1 className="text-3xl font-extrabold text-sky-700">Cadastrar Processo</h1>
        </div>
        <div className="flex justify-end w-3/4 items-center">
          <div onMouseEnter={() => setVisible(true)} className={`${verify.length > 0 ? 'hidden' : 'visible'}`}>
            <IoInformationCircleSharp className='text-sky-700' />
          </div>
        </div>
      </div>

      {/* Formulário de cadastro */}
      <FrmProcessos
        onEdit={onEdit}
        setOnEdit={setOnEdit}
        getProcessos={get}
        setSearchTerm={setSearchTerm}
        processos={processos}
        processoCnae={processoCnae}
        getProcessoCnaes={fetchProcessoCnae}
        getCnae={fetchCnae}
        cnae={cnae}
        setVerify={setVerify}
        setVerifyCnaes={setVerifyCnaes}
        verifyVinculo={verifyVinculo}
        setVerifyVinculo={setVerifyVinculo}
      />

      {/* Barra de pesquisa */}
      <div className="flex justify-center w-full">
        <div className="w-3/6">
          <SearchInput onSearch={handleSearch} placeholder="Buscar Processo..." />
        </div>
      </div>

      {/* Tabela Empresa */}
      <GridProcesso
        processos={filteredProcessos}
        setEmpresa={setProcessos}
        setOnEdit={handleEdit}
      />
    </div>
  )
}

export default Processos;