import React, { useEffect, useState } from 'react';
import icon_add from '../../../../media/icon_add.svg';
import ModalSearchCnae from './ModalSearchCnae';
import useAuth from '../../../../../hooks/useAuth';
import ReactDOM from 'react-dom';
import { PDFViewer, pdf } from "@react-pdf/renderer";
import RelatorioCnae from '../RelatorioGenerate/RelatorioCnae';
import { connect } from '../../../../../services/api';

const ModalRelatorioCnae = ({ onCancel, isOpen, companyId, empresas }) => {

  const { fetchCnae, fetchProcessoCnae, getProcessos } = useAuth(null);

  const [company, setCompany] = useState([]);
  const [companyCnae, setCompanyCnae] = useState([]);
  const [selectedCnaes, setSelectedCnaes] = useState([]);
  const [cnae, setCnae] = useState([]);
  const [processos, setProcessos] = useState([]);
  const [processoCnae, setProcessoCnae] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [pdfComponent, setPdfComponent] = useState(null);
  const [generatedPdf, setGeneratedPdf] = useState(null);

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

  useEffect(() => {
    getCnae();
    getProcessoCnae();
    fetchProcessos();

    if (companyId) {
      const find = empresas.find((i) => i.id_empresa === companyId);
      const findCnae = cnae.find((cnae) => cnae.subclasse_cnae === find.cnae_empresa);
      setCompany(find);
      setCompanyCnae(findCnae);
    }
  }, [isOpen]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const onSelectedCnaes = (cnaes) => {
    setSelectedCnaes(cnaes);
  };

  const handleGenerate = async () => {
    try {
      const selectedCnaesMap = [...selectedCnaes, companyCnae].map(cnae => cnae.id_cnae);
      console.log(selectedCnaesMap)

      const response = await fetch(`${connect}/relatorio_cnae`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cnaes: selectedCnaesMap }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório');
      }

      const data = await response.json();

      console.log("Relatório Gerado:", data);

      const doc = <RelatorioCnae
        data={data}
      />;
      setGeneratedPdf(doc);
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

  if (!isOpen) {
    return null;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay absolute inset-0 backdrop-blur-[1px] bg-black bg-opacity-10" onClick={onCancel}></div>
      <div className="modal-container w-4/6 bg-white mx-auto rounded-xl z-50 overflow-y-auto px-8 py-4 max-h-[80vh]">
        {/* Titulo */}
        <div className='flex justify-between items-center py-2'>
          <div className=''>
            <h1 className='text-xl font-bold text-sky-800'>Gerar Relatório</h1>
            <p>Gerar Relatório de processos por cnae</p>
          </div>
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
        <hr />
        {/* Cnae Principal */}
        <div className='w-full mt-3'>
          <div>
            <h2>Cnae Principal da empresa</h2>
            <ul>
              <li className='bg-gray-100 inline-flex py-1 px-2 rounded text-sky-600 font-bold'>{company.cnae_empresa || 'Empresa sem Cnae'}</li>
            </ul>
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
                <button type="button" className="bg-sky-600 py-2 px-4 font-bold text-white rounded cursor-pointer hover:bg-sky-700" onClick={handleGenerate}>
                  Gerar Relatório
                </button>
              </>
            )}
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
    </div>
  );
};


export default ModalRelatorioCnae;
