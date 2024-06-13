import React, { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import { toast } from "react-toastify";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

import LtcatGenerate from "../components/LaudoGenerate/LtcatGenerate";
import ModalSearchSetor from "../../subPages/components/Modal/ModalSearchSetor";
import ModalSearchUnidade from "../../subPages/components/Modal/ModalSearchUnidade"
import GridLaudo from "./Grids/GridLaudo";
import ModalSearchElaborador from "../components/Modal/ModalSearchElaborador";

import Back from '../../../layout/Back';
import { IoInformationCircleSharp } from "react-icons/io5";
import icon_sair from '../../../media/icon_sair.svg'
import icon_lupa from '../../../media/icon_lupa.svg'
import { connect } from "../../../../services/api";

function LaudoPgr() {

  const {
    loadSelectedCompanyFromLocalStorage,
    getInventario, inventario,
    fetchUnidades,
    fetchSetores,
    getGlobalSprm,
    getPlano, plano,
    getTable,user
  } = useAuth(null);


  const [companyId, setCompanyId] = useState(null);
  const [nameCompany, setNameCompany] = useState('');
  const [filteredInventario, setFilteredInventario] = useState([]);
  const [filteredPlano, setFilteredPlano] = useState([]);

  const [showModalUnidade, setShowModalUnidade] = useState(false);
  const [unidades, setUnidades] = useState([]);
  const [filteredUnidade, setFilteredUnidades] = useState([]);
  const [unidadeId, setUnidadeId] = useState('');
  const [nomeUnidade, setNomeUnidade] = useState('');

  const [showModalSetor, setShowModalSetor] = useState(false);
  const [setores, setSetores] = useState([]);
  const [filteredSetores, setFilteredSetores] = useState([]);
  const [setorId, setSetorId] = useState('');
  const [setorNome, setSetorNome] = useState('')
  
  const [showModalElaborador, setShowModalElaborador] = useState(false);
  const [elaboradores, setElaboradores] = useState([]);
  const [filteredElaborador, setFilteredElaborador] = useState([]);
  const [elaboradorId, setElaboradorId] = useState('');
  const [elaboradorNome, setElaboradorNome] = useState('');

  const [globalSprm, setGlobalSprm] = useState([]);

  const [pdfGrid, setPdfGrid] = useState(false);

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form
  const [data, setData] = useState('');
  const [versao, setVersao] = useState('');
  const [comentario, setComentario] = useState('');

  const [generatedPdf, setGeneratedPdf] = useState(null);
  const [pdfComponent, setPdfComponent] = useState(null);


  const getCompany = async () => {
    const selectCompany = await loadSelectedCompanyFromLocalStorage();
    setCompanyId(selectCompany.id_empresa);
    setNameCompany(selectCompany.nome_empresa);
  };

  useEffect(() => {
    getCompany();
  }, []);

  const handleGet = async () => {
    getInventario();
    getPlano();

    const unit = await fetchUnidades();
    setUnidades(unit);

    const setors = await fetchSetores();
    setSetores(setors);

    const sprm = await getGlobalSprm();
    setGlobalSprm(sprm);

    const authors = await getTable('elaboradores');
    setElaboradores(authors);
  };

  useEffect(() => {
    handleGet();
  }, [companyId]);


  // useEffect(() => {
  //   if (laudoVersion) {
  //     const pdfExists = laudoVersion.filter((i) => i.fk_empresa_id === companyId && i.laudo === 'ltcat');
  //     setLaudos(pdfExists);
  //     if (pdfExists) {
  //       setVersao(pdfExists.length + 1);
  //       setExists(true);
  //     } else {
  //       setVersao(1);
  //       setExists(false);
  //     }
  //   }
  // }, [laudoVersion])


  //Funções do Modal
  //Função para abrir o Modal
  const openModalUnidade = () => setShowModalUnidade(true);
  const openModalSetor = () => setShowModalSetor(true);
  const openModalElaborador = () => setShowModalElaborador(true);

  //Função para fechar o Modal
  const closeModalUnidade = () => setShowModalUnidade(false);
  const closeModalSetor = () => setShowModalSetor(false);
  const closeModalElaborador = () => setShowModalElaborador(false);

  // Função para atualizar a Unidade
 

  useEffect(() => {
    if (showModalSetor && unidadeId) {
      const filtered = setores.filter((i) => i.fk_unidade_id === unidadeId);
      setFilteredSetores(filtered);
    }
  }, [showModalSetor, unidadeId, setores]);

  const handleGerarRelatorio = async () => {
    if (!elaboradorId) {
      return toast.warn("Selecione um elaborador!");
    }

    setLoading(true);
    const res = await fetch(`${connect}/relatorio_pgr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ companyId: companyId , unidadeId: unidadeId, setorId: setorId}),
    });

    const data = await res.json();
    const setoresMap = data.setores.map((i) => i.id_setor);
    const filterSprm = globalSprm.filter((i) => setoresMap.includes(i.fk_setor_id));

    const resRelatorio = await generatePdf(data, filterSprm);
    setGeneratedPdf(resRelatorio);
    handleDownloadLtcat(resRelatorio);
    setLoading(false);
  }
   useEffect(() => {
    try {
      // Filtrando o inventario pelo id da Empresa
      if(companyId && !unidadeId && !setorId) {
        const inventarioFilter = inventario.filter((i) => i.fk_empresa_id === companyId);
        setFilteredInventario(inventarioFilter);
      }
      if(companyId && unidadeId && !setorId) {
        const inventarioFilter = inventario.filter((i) => i.fk_unidade_id === unidadeId);
        setFilteredInventario(inventarioFilter);
      }
      if(companyId && unidadeId &&  setorId) {
        const inventarioFilter = inventario.filter((i) => i.fk_setor_id === setorId);
        setFilteredInventario(inventarioFilter);
      }
      // Filtrando o plano de ação pelo id da Empresa 
      const planoFilter = plano.filter((i) => i.fk_empresa_id === companyId);
      setFilteredPlano(planoFilter);

    } catch (error) {
      toast.warn("Erro ao filtrar dados!")
      console.log("Erro ao filtrar dados!", error);
    }
  }, [companyId, inventario, plano, setorId, unidadeId]);
  const generatePdf = async ( dados, sprm) => {
    return (
      <LtcatGenerate
        inventario={filteredInventario}
        plano={filteredPlano}
        data={data}
        dados={dados}
        sprm={sprm}
        elaborador={filteredElaborador}
        user={user}
      />
    );
  };

  const handleDownloadLtcat = async (ltcat) => {
    const { blob } = await new Promise((resolve, reject) => {
      const pdfGenerated = (
        <PDFDownloadLink
          document={ltcat}
          fileName={`PGR - ${nameCompany}` || 'Programa de Gerenciamento de Riscos'}
        >
          {({ blob, url, loading, error }) => (
            <button
              type="button"
              disabled={loading}
              className={`${loading ? 'bg-gray-200 hover:bg-gray-200 text-gray-700' : 'bg-green-600'
                } py-2 px-8 font-bold text-lg text-white rounded cursor-pointer hover:bg-green-700`}>
              {loading ? 'Gerando PDF...' : 'Baixar PDF'}
            </button>
          )}
        </PDFDownloadLink>
      );
      setPdfComponent(pdfGenerated)
    })
  };

  // Clear
  const handleClear = () => {
    setPdfComponent(null);
    setPdfGrid(null);
    window.location.reload();
    handleClearElaborador();
  };

  const openPdfInNewTab = (pdfComponent) => {
    const newWindow = window.open();

    ReactDOM.render(
      <PDFViewer style={{ width: '100%', height: '100vh', margin: '0', padding: '0' }}>
        {pdfComponent}
      </PDFViewer>,
      newWindow.document.body
    );
  };


  // Data
  const handleChangeData = async (event) => {
    const date = new Date(event.target.value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setData(formattedDate);
  };

  const obterDataFormatada = async () => {
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  useEffect(() => {
    obterDataFormatada().then((dataFormatada) => {
      setData(dataFormatada);
    });
  }, []);

  // 

  const handleComentarioChange = (e) => {
    setComentario(e.target.value);
  };

  const handleUnidadeSelect = (unidadeId, nomeUnidade) => {
    closeModalUnidade();
    setUnidadeId(unidadeId)
    setNomeUnidade(nomeUnidade)
    handleClearSetor();
    const inventarioFilter = inventario.filter((i) => i.fk_unidade_id === unidadeId);
    console.log(inventarioFilter)
    setFilteredInventario(inventarioFilter);
    const planoFilter = plano.filter((i) => i.fk_unidade_id === unidadeId);
    setFilteredPlano(planoFilter);
    const unidadesFilter = unidades.filter((i) => i.id_unidade === unidadeId);
    setFilteredUnidades(unidadesFilter);
  };

  const handleClearUnidade = () => {
    setUnidadeId(null);
    setNomeUnidade(null);
    handleClearSetor();
    setFilteredSetores([]);
    
  };

  const handleSetorSelect = (SetorId, SetorName) => {
    closeModalSetor();
    setSetorId(SetorId);
    setSetorNome(SetorName);

    const inventarioFilter = inventario.filter((i) => i.fk_setor_id === setorId);
    setFilteredInventario(inventarioFilter);
    const planoFilter = plano.filter((i) => i.fk_setor_id === setorId);
    setFilteredPlano(planoFilter);
    const setorFilter = setores.filter((i) => i.id_setor === SetorId);
    setFilteredSetores(setorFilter);
  };

  const handleClearSetor = () => {
    setSetorId(null);
    setSetorNome(null);
  };

  const handleElaboradorSelect = (authors) => {
    setElaboradorId(authors.id_elaborador);
    setElaboradorNome(authors.nome_elaborador);
    setFilteredElaborador(authors);
    closeModalElaborador();
  };

  const handleClearElaborador = () => {
    setElaboradorId('');
    setElaboradorNome('');
  };

  return (
    <>

      {/* Popover */}
      <div className="flex w-full" onMouseLeave={() => setVisible(false)}>
        <div className="fixed z-50 m-2">
          <div className={`bg-gray-700 rounded-lg px-6 py-2 ${visible ? 'block' : 'hidden'} text-white`}>
            <h2 className="font-bold text-xl mb-2 text-gray-100 mt-2">Página para Gerar LTCAT</h2>
            <div>
              <p className="mb-2 text-justify font-light text-gray-300 flex">
                A página Laudo Técnico das Condições do Ambiente de Trabalho foi meticulosamente projetada para oferecer uma forma eficiente e organizada de gerar o LTCAT.
              </p>
              <p className="mb-2 text-justify font-light text-gray-300 flex">
                No canto superior esquerdo da tela, destaca-se um botão que proporciona a facilidade de retorno à página principal de Laudos, esse recurso visa garantir uma navegação ágil e intuitiva para os usuários. No centro da tela, apresentamos um formulário claro e de fácil compreensão para o definir como deseja gerar o relatório, tem a opção de gerar com todos os dados, tem a opção de gerar apenas de uma unidade e tambem a opção de gerar apenas um setor. Além disso, apresentamos uma tabela organizada abaixo, contendo as versões do LTCAT. Em uma coluna dedicada é disponibilizado um botão utilizado para gerar e baixar aquela versão especifica. Ao gerar um relatório novo ou uma versão ficam disponibilizadas duas opções, uma para abrir o laudo em uma nova aba e outra para baixar o laudo. Para abrir em uma nova aba basta clicar no botao que surge ao gerar um laudo, localizado em cima da tabela no canto direito, e para baixar voce utiliza o mesmo botão que geroum, tanto um novo quanto uma versão.
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Titulo */}
      <div className="grid grid-cols-5 mb-10 mt-10">
        {/* Botão para voltar */}
        <div className="col-span-1">
          <Link to="/laudos">
            <Back />
          </Link>
        </div>
        <div className="col-span-3 flex justify-center text-center">
          <h1 className="text-3xl font-extrabold text-sky-700">LTCAT - Laudo Técnico das Condições do Ambiente de Trabalho</h1>
        </div>
        <div className="col-span-1 flex justify-center pt-3">
          <div onMouseEnter={() => setVisible(true)}>
            <IoInformationCircleSharp className='text-sky-700' />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex justify-center">
        <form className="w-full max-w-7xl">
          <div className="flex flex-wrap -mx-3 mb-6 p-3">

            {/* Data */}
            <div className="w-full md:w-1/3 px-3">
              <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="data">
                Data:
              </label>
              <input
                className={`appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 `}
                type="date"
                name="data_ltcat"
                id="data"
                value={data}
                onChange={handleChangeData}
              />
            </div>

            {/* Unidade */}
            <div className="w-full md:w-1/3 px-3">
              <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-fk_unidade_id">
                Unidade:
              </label>
              <div className="flex items-center w-full" id="grid-fk_unidade_id">
                {nomeUnidade ? (
                  <>
                    <button
                      className="flex appearance-none w-full hover:shadow-sm text-sky-600 bg-gray-100 border-gray-200 mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text"
                      onClick={openModalUnidade}
                      type="button"
                    >
                      <p className="font-bold w-full">
                        {nomeUnidade}
                      </p>
                    </button>
                    <button className="ml-4" onClick={handleClearUnidade}
                    type="button">
                      <img src={icon_sair} alt="" className="h-9" />
                    </button>
                  </>
                ) : (
                  <button
                    className="flex w-full appearance-none text-gray-400 bg-gray-100 border-gray-200 justify-center mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text"
                    onClick={openModalUnidade}
                    type="button"
                  >
                    <p className="text-sm font-medium w-full">
                      Nenhuma Unidade Selecionado
                    </p>
                  </button>
                )}
                <button
                  type="button"
                  onClick={openModalUnidade}
                  
                  className={`flex cursor-pointer ml-4 `}
                >
                  <img src={icon_lupa} className="h-9 cursor-pointer" alt="Icone adicionar unidade"></img>
                </button>
              </div>
              <ModalSearchUnidade
                isOpen={showModalUnidade}
                onCancel={closeModalUnidade}
                children={unidades}
                onContactSelect={handleUnidadeSelect}
              />
            </div>

            {/* Setor */}
            <div className="w-full md:w-1/3 px-3">
              <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-fk_setor_id">
                Setor:
              </label>
              <div className="flex items-center w-full" id="grid-fk_setor_id">
                {setorNome ? (
                  <>
                    <button
                      className="flex w-full appearance-none hover:shadow-sm text-sky-600 bg-gray-100 border-gray-200 justify-center mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text"
                      onClick={openModalSetor}
                      type="button"
                    >
                      <p className="font-bold w-full">
                        {setorNome}
                      </p>
                    </button>
                    <button className="ml-4 cursor-pointer" onClick={handleClearSetor} type="button">
                      <img src={icon_sair} alt="" className="h-9" />
                    </button>
                  </>
                ) : (
                  <button
                    className="flex w-full appearance-none text-gray-400 bg-gray-100 border-gray-200 justify-center mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text"
                    onClick={openModalSetor}
                    type="button"
                  >
                    <p className="px-2 text-sm font-medium w-full">
                      Nenhum Setor Selecionado
                    </p>
                  </button>
                )}

                <button
                  type="button"
                  onClick={openModalSetor}
                  className={`flex cursor-pointer ml-4`}
                >
                  <img src={icon_lupa} className="h-9 cursor-pointer" alt="Icone adicionar unidade"></img>
                </button>
              </div>
              <ModalSearchSetor
                isOpen={showModalSetor}
                onCancel={closeModalSetor}
                children={filteredSetores}
                onContactSelect={handleSetorSelect}
              />
            </div>
  {/* ELaborador */}
  <div className="w-full md:w-4/12 px-3">
              <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="elaborador">
                Elaborador:
              </label>
              <div className="flex items-center w-full" id="elaborador">
                {elaboradorId ? (
                  <>
                    <button
                      className="flex w-full appearance-none hover:shadow-sm text-sky-600 bg-gray-100 border-gray-200 justify-center mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text"
                      type="button"
                      onClick={openModalElaborador}
                    >
                      <p className="font-bold w-full">
                        {elaboradorNome}
                      </p>
                    </button>
                    <button className="ml-4 cursor-pointer" onClick={handleClearElaborador} type="button">
                      <img src={icon_sair} alt="" className="h-9" />
                    </button>
                  </>
                ) : (
                  <button
                    className="flex w-full appearance-none text-gray-400 bg-gray-100 border-gray-200 justify-center mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text"
                    type="button"
                    onClick={openModalElaborador}
                  >
                    <p className="px-2 text-sm font-medium w-full">
                      Nenhum Elaborador Selecionado
                    </p>
                  </button>
                )}

                <button
                  type="button"
                  onClick={openModalElaborador}
                  className={`flex cursor-pointer ml-4`}
                >
                  <img src={icon_lupa} className="h-9 cursor-pointer" alt="Icone adicionar elaborador"></img>
                </button>
              </div>
              <ModalSearchElaborador
                isOpen={showModalElaborador}
                onCancel={closeModalElaborador}
                children={elaboradores}
                onSelect={handleElaboradorSelect}
              />
            </div>
            {/* Versão */}
            <div className="w-full md:w-1/12 px-3">
              <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="versao">
                Versão:
              </label>
              <input
                className={`appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 `}
                type="text"
                id="versao"
                name="versao"
                value= {1.0}
                placeholder="Versão do Laudo"
                disabled
              />
            </div>

            {/* Comentário */}
            <div className="w-full md:w-11/12 px-3">
              <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="comentario">
                Comentário:
              </label>
              <textarea
                className={`resize-none appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 `}
                type="text"
                id="comentario"
                name="comentario"
                value={comentario}
                placeholder="Descreva as atualizações"
                onChange={handleComentarioChange}
              />
            </div>

          </div>
          <div className="flex justify-end mt-10 gap-4">
            < button type="button" className="bg-red-600 py-2 px-8 font-bold text-lg text-white rounded cursor-pointer hover:bg-red-700" onClick={handleClear}>
              Limpar
            </button>
            {generatedPdf ? (
              <>
                <button
                  className="bg-yellow-500 py-2 px-4 rounded font-bold text-white hover:bg-yellow-600 cursor-pointer"
                  onClick={() => openPdfInNewTab(generatedPdf)}
                  type="button"
                >
                  Abrir em Nova Aba
                </button>
                {pdfComponent && (
                  pdfComponent
                )}
              </>
            ) : (
              <button
                type="button"
                disabled={loading}
                className={`${loading ? 'bg-gray-200 hover:bg-gray-200 text-white cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'} py-2 px-8 font-bold text-lg rounded `}
                onClick={handleGerarRelatorio}
              >
                {loading ? 'Gerando LTCAT...' : 'Gerar LTCAT'}
              </button>
            )}

          </div>

        </form >
      </div >


      {/* Grid */}
      {/* <GridLaudo
        children={laudos}
        empresas={empresas}
        handleGenerate={handleGenerate}
        pdf={pdfGrid}
        companyId={companyId}
      /> */}

    </>
  )
}

export default LaudoPgr;