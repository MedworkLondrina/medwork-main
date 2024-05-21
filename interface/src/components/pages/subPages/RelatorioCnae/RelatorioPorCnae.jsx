import React, { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import icon_add from '../../../media/icon_add.svg';
import ReactDOM from 'react-dom';
import { PDFViewer, pdf } from "@react-pdf/renderer";
import ModalSearchCnae from "../components/Modal/ModalSearchCnae";
import { connect } from "../../../../services/api";

function RelatorioCnae() {

  const { loadSelectedCompanyFromLocalStorage, companyId, fetchEmpresas, fetchCnae, fetchProcessoCnae, getProcessos } = useAuth(null);

  const [company, setCompany] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [companyCnae, setCompanyCnae] = useState([]);
  const [selectedCnaes, setSelectedCnaes] = useState([]);
  const [cnae, setCnae] = useState([]);
  const [processos, setProcessos] = useState([]);
  const [processoCnae, setProcessoCnae] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pdfComponent, setPdfComponent] = useState(null);
  const [generatedPdf, setGeneratedPdf] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSelectedCompanyFromLocalStorage();
  }, []);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const getCnae = async () => {
    const response = await fetchCnae();
    setCnae(response);
  };

  const getProcessoCnae = async () => {
    const response = await fetchProcessoCnae();
    setProcessoCnae(response);
  };

  const fetchProcessos = async () => {
    const response = await getProcessos();
    setProcessos(response);
  };

  const getEmpresas = async () => {
    const response = await fetchEmpresas();
    const find = response.find((i) => i.id_empresa === companyId);
    setCompany(find);
  };

  useEffect(() => {
    getEmpresas();
    getCnae();
    getProcessoCnae();
    fetchProcessos();

    if (company) {
      const findCnae = cnae.find((cnae) => cnae.subclasse_cnae === company.cnae_empresa);
      setCompanyCnae(findCnae);
    }
  }, [companyId]);

  const onSelectedCnaes = (cnaes) => {
    setSelectedCnaes(cnaes);
  };

  const handleGenerate = async (data) => {
    try {
      // Buscar os processos dos cnaes selecionados
      // const filterCompanyProc = processoCnae.filter((i) => i.fk_cnae_id === companyCnae.id_cnae);
      // const findCompanyProc = processos.find((i) => i.id_processo === filterCompanyProc[0].fk_processo_id);
      // const selectedCnaesMap = selectedCnaes.map((i) => i.id_cnae);
      // const filterProcCnae = processoCnae.filter((i) => selectedCnaesMap.includes(i.fk_cnae_id));
      // const filterProcCnaeMap = filterProcCnae.map((i) => i.fk_processo_id);
      // const filterProcess = processos.filter((i) => filterProcCnaeMap.includes(i.id_processo));

      // console.log("Empresa: ", company);
      // console.log("Cnae Empresa: ", companyCnae);
      // console.log("Processos Empresa: ", findCompanyProc);
      // console.log("Cnaes Selecionados: ", selectedCnaes);
      // console.log("Processos Filtrados: ", filterProcess);

      const doc = <RelatorioCnae
        // company={company}
        // companyCnae={companyCnae}
        // companyProcess={findCompanyProc}
        // selectedCnaes={selectedCnaes}
        // filterProcess={filterProcess}
        data={data}
      />;
      setGeneratedPdf(doc);
      setLoading(false);
    } catch (error) {
      console.log("Erro ao gerar PDF!", error);
    }
  };

  const printPdf = (doc) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = URL.createObjectURL(new Blob([doc], { type: 'application/pdf' }));
    document.body.appendChild(iframe);
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };

  const openPdfInNewTab = (doc) => {
    const newWindow = window.open();
    ReactDOM.render(<PDFViewer style={{ width: '100%', height: '100vh', margin: '0', padding: '0' }}>{doc}</PDFViewer>, newWindow.document.body);
  };

  const handleClear = () => {
    setPdfComponent(null);
    setGeneratedPdf(null);
  };

  const fetchRelatorioCnae = async () => {
    try {
      setLoading(true);
      // Objeto para armazenar os dados dos CNAEs
      const Cnaes = {};

      // Iterar sobre cada CNAE em cnaes
      for (const cnae of selectedCnaes) {
        const { id_cnae } = cnae;

        const responseProcessos = await fetch(`${connect}/processos_por_cnae?id_cnae=${id_cnae}`);

        // Verificar se a resposta está no formato JSON
        const contentTypeProcessos = responseProcessos.headers.get("content-type");

        // Processar os dados da resposta dos processos
        let processos;
        if (contentTypeProcessos && contentTypeProcessos.indexOf("application/json") !== -1) {
          processos = await responseProcessos.json();
        } else {
          // Lidar com respostas que não são JSON
          const text = await responseProcessos.text();
          console.log("Resposta de processos não JSON:", text);
          continue;
        }

        // Objeto para armazenar os processos deste CNAE
        const Processos = {};

        // Iterar sobre cada processo e obter os riscos associados a ele
        for (const processo of processos) {
          const { id_processo } = processo;

          // Fazer uma requisição para obter os riscos associados a esse processo
          const responseRiscos = await fetch(`${connect}/riscos_por_processo?id_processo=${id_processo}`);

          // Verificar se a resposta está no formato JSON
          const contentTypeRiscos = responseRiscos.headers.get("content-type");

          // Processar os dados da resposta dos riscos
          let riscos;
          if (contentTypeRiscos && contentTypeRiscos.indexOf("application/json") !== -1) {
            riscos = await responseRiscos.json();
          } else {
            // Lidar com respostas que não são JSON
            const text = await responseRiscos.text();
            console.log("Resposta de riscos não JSON:", text);
            continue;
          }

          // Objeto para armazenar os riscos deste processo
          const Riscos = {};

          // Iterar sobre cada risco e obter as medidas associadas a ele
          for (const risco of riscos) {
            const { id_risco } = risco;

            // Fazer uma requisição para obter as medidas associadas a esse risco
            const responseMedidas = await fetch(`${connect}/medidas_por_risco?id_risco=${id_risco}`);

            // Verificar se a resposta está no formato JSON
            const contentTypeMedidas = responseMedidas.headers.get("content-type");

            // Processar os dados da resposta das medidas
            let medidas;
            if (contentTypeMedidas && contentTypeMedidas.indexOf("application/json") !== -1) {
              medidas = await responseMedidas.json();
            } else {
              // Lidar com respostas que não são JSON
              const text = await responseMedidas.text();
              console.log("Resposta de medidas não JSON:", text);
              continue; // Pula para o próximo risco se a resposta não for JSON
            }

            // Adicionar as medidas ao objeto de riscos deste processo
            Riscos[`id_risco: ${id_risco}`] = {
              medidas
            };
          }

          // Adicionar os riscos ao objeto de processos deste CNAE
          Processos[`id_processo: ${id_processo}`] = {
            Riscos
          };
        }

        // Adicionar os processos ao objeto de CNAEs
        Cnaes[`id_cnae: ${id_cnae}`] = {
          Processos
        };
      }

      console.log("Relatório CNAEs:", Cnaes);
      handleGenerate(Cnaes);
      return Cnaes;
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-11/12">
          <div className="mb-10 mt-10">
            {/* Titulo */}
            <div className="flex justify-center mb-5">
              <h1 className="text-3xl font-extrabold text-sky-700">Relatório por CNAE</h1>
            </div>
            <div className="">
              {/* Titulo */}
              <div className='flex justify-between items-center py-2'>
                <div className=''>
                  <p>Gerar Relatório de processos, riscos e medidas por cnae</p>
                </div>
              </div>
              <hr />
              {/* Cnae Principal */}
              <div className='w-full mt-3'>
                <div>
                  <h2>Cnae Principal da empresa: <span className="text-sky-600 font-bold">{company.cnae_empresa || 'Empresa sem Cnae'}</span></h2>
                </div>
              </div>
              {/* Outros Cnaes */}
              <div className='w-full mt-3'>
                <div className={`w-full ${selectedCnaes.length === 1 ? 'md:w-1/2' : selectedCnaes.length > 1 ? 'md:w-full' : 'md:w-1/2'}`}>
                  <label className={`tracking-wide text-gray-700 text-xs font-bold mb-2`}>
                    {selectedCnaes.length > 0 ? `CNAE's Selecionados` : `Selecione outros CNAE's`}:
                  </label>
                  <div className="flex items-center w-full">
                    {selectedCnaes.length > 0 ? (
                      <>
                        <div className="w-full flex gap-2 items-center">
                          <button
                            className={`flex appearance-none text-sky-600 mt-1 rounded leading-tight focus:outline-none with-text ${selectedCnaes ? 'w-full' : 'bg-gray-100 border border-gray-200 py-3 px-4 hover:shadow-sm'}`}
                            type="button"
                            onClick={openModal}
                          >
                            <div
                              className={`w-full grid gap-2 ${selectedCnaes.length === 1 ? 'grid-cols-1' :
                                selectedCnaes.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}
                          }`}
                            >
                              {selectedCnaes.map((item, i) => (
                                <>
                                  <div className="col-span-1 shadow border border-gray-100 rounded px-3 py-2">
                                    <div className='grid grid-cols-12'>
                                      <div className="col-span-11">
                                        <p className="font-bold text-left text-sky-700">
                                          {item.subclasse_cnae}
                                        </p>
                                      </div>
                                      <div className='col-span-1'>
                                        <p className='font-bold text-sky-700 text-right'>
                                          {item.grau_risco_cnae}
                                        </p>
                                      </div>
                                    </div>
                                    <div className='border-gray-300 border-b mb-2'></div>
                                    <div className='text-left'>
                                      <p className="text-gray-700 text-xs font-light">Descrição:</p>
                                      <p className='text-gray-800 text-sm'>{item.descricao_cnae}</p>
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={openModal}
                            className={`flex cursor-pointer ml-4`}
                          >
                            <img src={icon_add} className={`h-9`} alt="Icone adicionar usuario"></img>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex gap-2 w-full items-center">
                          <button
                            className={`flex w-full appearance-none text-gray-400 bg-gray-100 border-gray-200 justify-center mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text`}
                            type="button"
                            onClick={openModal}
                          >
                            <p className="px-2 text-sm font-medium">
                              Nenhum CNAE Selecionado
                            </p>
                          </button>
                          <button
                            type="button"
                            onClick={openModal}
                            className={`flex cursor-pointer ml-4`}
                          >
                            <img src={icon_add} className={`h-9`} alt="Icone adicionar cnae"></img>
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                </div>
              </div>
              {/* Botoes */}
              <div className='w-full mt-6'>
                <div className='flex justify-end items-center gap-2'>

                  {/* Botão Abrir em nova aba */}
                  {generatedPdf ? (
                    <>
                      {/* Limpar */}
                      <button
                        className="bg-red-600 py-2 px-4 font-bold text-white rounded cursor-pointer hover:bg-red-700"
                        onClick={handleClear}
                      >
                        Limpar
                      </button>
                      {/* Abrir em nova aba */}
                      <button
                        className="bg-green-600 py-2 px-4 font-bold text-white rounded cursor-pointer hover:bg-green-700"
                        onClick={() => openPdfInNewTab(generatedPdf)}
                      >
                        Abrir em Nova Aba
                      </button>
                      {/* Imprimir */}
                      <button
                        className="bg-teal-600 py-2 px-4 font-bold text-white rounded cursor-pointer hover:bg-teal-700"
                        onClick={() => printPdf(generatedPdf)}
                      >
                        Imprimir
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="bg-sky-600 py-2 px-4 font-bold text-white rounded cursor-pointer hover:bg-sky-700" onClick={() => fetchRelatorioCnae()}>
                        {loading ? 'Gerando...' : 'Gerar Relatório'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modais */}
      <ModalSearchCnae
        isOpen={showModal}
        onCancel={closeModal}
        onSelect={onSelectedCnaes}
        selectedCnaes={selectedCnaes}
      />
    </>
  );
}

export default RelatorioCnae;