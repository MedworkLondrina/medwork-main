//Importando Ferramentas
import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { connect } from "../../../../services/api";

import ModalSearchCnae from "../components/Modal/ModalSearchCnae";
import icon_lupa from '../../../media/icon_lupa.svg';
import icon_add from '../../../media/icon_add.svg';

function CadastroProcesso({ onEdit, getProcessos, setOnEdit, setSearchTerm, processos, getProcessoCnaes, getCnae, setVerify, setVerifyCnaes, verifyVinculo, setVerifyVinculo }) {

  //Instanciando as Variáveis
  const ref = useRef(null);
  const [processo, setProcesso] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCnaes, setSelectedCnaes] = useState([]);
  const [processoCnae, setProcessoCnae] = useState([]);
  const [cnae, setCnae] = useState([]);

  const get = async () => {
    const resProcessoCnae = await getProcessoCnaes();
    setProcessoCnae(resProcessoCnae);
    const resCnae = await getCnae();
    setCnae(resCnae);
  };

  // Colocando as informações do formulario nas variaveis
  useEffect(() => {
    get();
    if (onEdit) {
      setProcesso(onEdit.nome_processo || "");
      const procCnae = processoCnae.filter((proc) => proc.fk_processo_id === onEdit.id_processo);
      const mapCnae = procCnae.map((proc) => proc.fk_cnae_id);
      const filterCnaes = cnae.filter((cnae) => mapCnae.includes(cnae.id_cnae));
      setSelectedCnaes(filterCnaes);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [onEdit]);

  const verifyProcessRegister = async (processo) => {
    const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
    getProcessos();

    try {
      const process = processos.filter((proc) => normalizeString(proc.nome_processo) === normalizeString(processo));

      if (process.length > 0) {
        return process;
      }
    } catch (error) {
      console.error(`Erro ao verificar registro do processo ${processo}!`, error)
    }
  };

  const verifyCnaeRegister = async (idProcesso, selectedCnaes) => {
    const procCnae = processoCnae.filter((proc) => proc.fk_processo_id === idProcesso);
    const cnaesVinculados = procCnae.map((proc) => proc.fk_cnae_id);

    const cnaesParaVincular = selectedCnaes.filter(cnae => !cnaesVinculados.includes(cnae.id_cnae));

    return cnaesParaVincular;
  }

  //Função para adicionar ou atualizar dados
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user"));
    const tenant = userData.tenant_code;
    const nome = userData.nome_usuario;
    const queryParams = new URLSearchParams({ tenant_code: tenant, nome_usuario: nome }).toString();

    //Verificandose todos os campos foram preenchidos
    if (
      !processo || selectedCnaes.length === 0) {
      return toast.warn("Preencha Todos os Campos!");
    }
    try {

      const resVerify = await verifyProcessRegister(processo);

      let cnaesParaVincular = [];

      if (resVerify) {
        cnaesParaVincular = await verifyCnaeRegister(resVerify[0]?.id_processo, selectedCnaes);
        if (!onEdit) {
          return toast.warn(`Já existem processos cadastrados com esse nome: ${processo}!`);
        }
      }

      const processoData = {
        nome_processo: processo,
        tenant_code: tenant,
      };

      const url = onEdit
        ? `${connect}/processos/${onEdit.id_processo}?${queryParams}`
        : `${connect}/processos?${queryParams}`

      const method = onEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processoData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao cadastrar/Editar processo. Status: ${response.status}`);
      }

      const responseData = await response.json();
      const processoId = responseData.id;

      onEdit ? toast.success('Processo atualizado com sucesso!') : toast.success('Processo cadastrado com sucesso!');

      const cnaesToLink = onEdit ? cnaesParaVincular : selectedCnaes;
      const idProcesso = onEdit ? onEdit.id_processo : processoId;

      // Vincular os cnaes
      for (const cnae of cnaesToLink) {
        const cnaeData = {
          fk_processo_id: idProcesso,
          fk_cnae_id: cnae.id_cnae,
        };

        const cnaeResponse = await fetch(`${connect}/processo_cnae?${queryParams}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cnaeData),
        });

        if (!cnaeResponse.ok) {
          throw new Error(`Erro ao cadastrar cnae. Status: ${cnaeResponse.status}`);
        }

        toast.success(`Cnae ${cnae.subclasse_cnae} vinculado com sucesso!`);
      }
      //Limpa os campos e reseta o estaodo de edição
      handleClear();

      //Atualiza os dados
      getProcessos();
    } catch (error) {
      toast.error("Erro ao cadastrar ou editar processo!")
      console.log("Erro ao cadastrar ou editar processo: ", error);
    }

  };

  //Função para limpar o formulário
  const handleClear = () => {
    setProcesso('');
    setOnEdit(null);
    setSearchTerm('');
    setSelectedCnaes([]);
    setVerify([]);
    setVerifyCnaes([]);
    setVerifyVinculo(false);
  };

  const handleSearchProcesso = (e) => {
    const term = e.target.value;
    setProcesso(term);
    if (!term) {
      setSearchTerm('');
    }
    setSearchTerm(term);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const onSelectedCnaes = (cnaes) => {
    setSelectedCnaes(cnaes);
  };

  const handleBlurProcesso = async () => {
    setVerify([]);
    setVerifyCnaes([]);
    setVerifyVinculo(false);
    if (processo && !onEdit) {
      const verifyProcess = await verifyProcessRegister(processo);
      if (verifyProcess) {
        const procCnae = processoCnae.filter((proc) => proc.fk_processo_id === verifyProcess[0].id_processo);
        const mapCnae = procCnae.map((proc) => proc.fk_cnae_id);
        const filterCnaes = cnae.filter((cnae) => mapCnae.includes(cnae.id_cnae));
        setVerify(verifyProcess);
        setVerifyCnaes(filterCnaes);
        setVerifyVinculo(true);
      };
    };
  };

  return (
    <div className="flex justify-center">
      <form className="w-full max-w-5xl" ref={ref} onSubmit={handleSubmit}>
        <div className="-mx-3 mb-6 p-3">
          {/* Campos Formulário */}
          <div className={`flex ${selectedCnaes.length > 0 ? 'flex-wrap' : ''}`}>
            {/* Nome */}
            <div className="w-full md:w-1/2 px-3">
              <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-nome_empresa">
                Nome do Processo
              </label>
              <input
                className="appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
                type="text"
                name="nome_processo"
                placeholder="Nome do Processo"
                onChange={handleSearchProcesso}
                value={processo}
                onBlur={handleBlurProcesso}
              />
            </div>

            {/* Cnae */}
            <div className={`w-full ${selectedCnaes.length === 1 ? 'md:w-1/2' : selectedCnaes.length > 1 ? 'md:w-full' : 'md:w-1/2'} ${verifyVinculo ? 'opacity-50 cursor-not-allowed' : ''} px-3`}>
              <label className={`tracking-wide text-gray-700 text-xs font-bold mb-2 ${verifyVinculo ? 'cursor-not-allowed' : ''}`} htmlFor="grid-fk_contato_id">
                {selectedCnaes.length > 0 ? `CNAE's Selecionados` : `Selecione os CNAE's`}:
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
                            selectedCnaes.length === 2 ? 'grid-cols-2' :
                              selectedCnaes.length === 3 ? 'grid-cols-3' : 'grid-cols-4'
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
                        disabled={verifyVinculo}
                        onClick={openModal}
                        className={`flex cursor-pointer ml-4 ${verifyVinculo ? 'cursor-not-allowed' : ''}`}
                      >
                        <img src={icon_add} className={`h-9 ${verifyVinculo ? 'cursor-not-allowed' : ''}`} alt="Icone adicionar usuario"></img>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-2 w-full items-center">
                      <button
                        className={`flex w-full appearance-none text-gray-400 bg-gray-100 border-gray-200 justify-center mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text ${verifyVinculo ? 'cursor-not-allowed' : ''}`}
                        type="button"
                        disabled={verifyVinculo}
                        onClick={openModal}
                      >
                        <p className="px-2 text-sm font-medium">
                          Nenhum CNAE Selecionado
                        </p>
                      </button>
                      <button
                        type="button"
                        disabled={verifyVinculo}
                        onClick={openModal}
                        className={`flex cursor-pointer ml-4 ${verifyVinculo ? 'cursor-not-allowed' : ''}`}
                      >
                        <img src={icon_add} className={`h-9 ${verifyVinculo ? 'cursor-not-allowed' : ''}`} alt="Icone adicionar usuario"></img>
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>

          {/* Botões Formulário */}
          <div className="w-full flex justify-end gap-3 px-3">
            <div>
              <button onClick={handleClear} className="shadow mt-4 bg-red-600 hover:bg-red-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
                Limpar
              </button>
            </div>
            <div className="">
              <button className="shadow mt-4 bg-green-600 hover:bg-green-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </form>
      {/* Modais */}
      <ModalSearchCnae
        isOpen={showModal}
        onCancel={closeModal}
        processo={processo}
        onSelect={onSelectedCnaes}
        selectedCnaes={selectedCnaes}
      />
    </div>
  )
}

export default CadastroProcesso;