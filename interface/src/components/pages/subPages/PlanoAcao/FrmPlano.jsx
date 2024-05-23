import React, { useEffect, useRef, useState } from "react";
import { connect } from "../../../../services/api";
import { toast } from "react-toastify";

import LoadingScreen from "../components/LoadingScreen";
import ModalSearchUnidade from "../components/Modal/ModalSearchUnidade";
import ModalSearchSetor from "../components/Modal/ModalSearchSetor";
import ModalSearchProcesso from '../components/Modal/ModalSearchProcesso';
import ModalSearchRisco from '../components/Modal/ModalSearchRisco';
import ModalMedidasDefine from "../components/Modal/ModalMedidasDefine";

import icon_sair from '../../../media/icon_sair.svg'
import icon_lupa from '../../../media/icon_lupa.svg'

function FrmPlano({
  unidades,
  cargos,
  setores,
  setoresProcessos,
  processos,
  processosRiscos,
  riscos,
  onEdit,
  companyId,
  setOnEdit,
  riscosMedidas,
  medidas,
  getGlobalSprm, setGlobalSprm, globalSprm,
  companyName,
  
  getPlano,
  contatos,
  planos,
}) {

  const user = useRef();

  const [loading, setLoading] = useState(false);

  const [filteredSetores, setFilteredSetores] = useState([])
  const [filteredProcessos, setFilteredProcessos] = useState([])
  const [filteredRiscos, setFilteredRiscos] = useState([]);

  const [showModalUnidade, setShowModalUnidade] = useState(false);
  const [showModalSetor, setShowModalSetor] = useState(false);
  const [showModalProcesso, setShowModalProcesso] = useState(false);
  const [showModalRisco, setShowModalRisco] = useState(false);
  const [showModalMedidas, setShowModalMedidas] = useState(false);

  const [unidadeId, setUnidadeId] = useState('');
  const [setorId, setSetorId] = useState('');
  const [processoId, setProcessoId] = useState('');
  const [riscoId, setRiscoId] = useState('');
  const [nomeUnidade, setNomeUnidade] = useState('');
  const [setorNome, setSetorNome] = useState('');
  const [processoNome, setProcessoNome] = useState('');
  const [riscoNome, setRiscoNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [isOk, setIsOk] = useState(false);
  const [filterGlobalSprm, setFilterGlobalSprm] = useState([]);
  const [filteredMedidas, setFilteredMedidas] = useState([]);
  const [filteredPlanoRisco, setFilteredPlanoRisco] = useState([]);
  const [isVerify, setIsVerify] = useState(false);
  const [plano, setPlano] = useState(false);
  //Inputs Form
  const [data, setData] = useState('');
  const [selectedPrazos, setSelectedPrazos] = useState({});
  const [existingPrazos, setExistingPrazos] = useState({});

  //Função para abrir o Modal
  const openModalUnidade = () => setShowModalUnidade(true);
  const openModalSetor = () => setShowModalSetor(true);
  const openModalProcesso = () => setShowModalProcesso(true);
  const openModalRisco = () => setShowModalRisco(true);
  const openModalMedidas = () => {
    setPlano(true);
    setShowModalMedidas(true)
  };
  //Função para fechar o Modal
  const closeModalUnidade = () => setShowModalUnidade(false);
  const closeModalSetor = () => setShowModalSetor(false);
  const closeModalProcesso = () => setShowModalProcesso(false);
  const closeModalRisco = () => setShowModalRisco(false);
  const closeModalMedidas = () => {
    getGlobalSprm();
    setShowModalMedidas(false);
  }

  const obterDataFormatada = () => {
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  useEffect(() => {
    setData(obterDataFormatada)
  }, [])

 
  useEffect(() => {
    if (showModalSetor && unidadeId) {
      const filtered = setores.filter((i) => i.fk_unidade_id === unidadeId);
      setFilteredSetores(filtered);
    }
  }, [showModalSetor, unidadeId, setores]);

  useEffect(() => {
    const filterList = () => {
      if (!onEdit) {
        const sprm = globalSprm.filter(
          ({ fk_setor_id, fk_processo_id, fk_risco_id }) =>
            fk_setor_id === setorId && fk_processo_id === processoId && fk_risco_id === riscoId
        );
        const filterApply = sprm.filter(({ status }) => status && status !== "Aplica");
        const planFilter = planos.filter(
          ({ fk_empresa_id, fk_medida_id }) =>
            fk_empresa_id === companyId && filterApply.some(({ fk_medida_id: sprmId }) => sprmId === fk_medida_id)
        );
        const filterSprm = sprm.filter(({ status }) => status && status === "Não Aplica");
        const sprmMap = new Set(filterSprm.map(({ fk_medida_id }) => fk_medida_id));
        const filterPlan = planos.filter(({ fk_empresa_id, fk_medida_id }) => fk_empresa_id === companyId && sprmMap.has(fk_medida_id));
        const listMedidas = medidas.filter(({ id_medida }) => sprmMap.has(id_medida) && !filterPlan.some(({ fk_medida_id }) => fk_medida_id === id_medida));
        const listModalMedidas = filterApply.filter(({ fk_medida_id }) => !planFilter.map(({ fk_medida_id }) => fk_medida_id).includes(fk_medida_id));
        setFilterGlobalSprm(listModalMedidas);
        setFilteredMedidas(listMedidas);
      }
    }

    filterList();
  }, [riscoId, globalSprm]);

  useEffect(() => {
    const handleEdit = async () => {
      if (onEdit) {
        try {
          if (onEdit.fk_unidade_id) {
            const unidadeSelect = unidades.find((i) => i.id_unidade === onEdit.fk_unidade_id);
            await handleUnidadeSelect(onEdit.fk_unidade_id, unidadeSelect.nome_unidade);
          }
          if (onEdit.fk_setor_id) {
            const setorSelect = setores.find((i) => i.id_setor === onEdit.fk_setor_id);
            await handleSetorSelect(onEdit.fk_setor_id, setorSelect.nome_setor);
          }
          if (onEdit.fk_processo_id) {
            const processoSelect = processos.find((i) => i.id_processo === onEdit.fk_processo_id);
            await handleProcessoSelect(onEdit.fk_processo_id, processoSelect.nome_processo);
          }
          if (onEdit.fk_risco_id) {
            const riscoSelect = riscos.find((i) => i.id_risco === onEdit.fk_risco_id);
            await handleRiscoSelect(onEdit.fk_risco_id, riscoSelect.nome_risco, onEdit.fk_medida_id, onEdit.tipo_medida);
          }
          if (onEdit.fk_medida_id) {
            const findMedida = medidas.find((i) => i.id_medida === onEdit.fk_medida_id);
            setFilteredMedidas([findMedida]);
            if (onEdit.prazo) {
              setSelectedPrazos((prevPrazos) => ({
                ...prevPrazos,
                [onEdit.fk_medida_id]: onEdit.prazo,
              }));
            }
          }
          handleFilterGlobalSprm();
        } catch (error) {
          console.error("Erro ao buscar dados para edição!", error)
        }
      }
    }

    handleEdit();
  }, [onEdit])

  // Função para atualizar a Unidade
  const handleUnidadeSelect = async (unidadeId, nomeUnidade) => {
    closeModalUnidade();
    setUnidadeId(unidadeId)
    setNomeUnidade(nomeUnidade)
    handleClearSetor();

    const unicunidade = unidades.filter((i) => i.id_unidade === unidadeId);
    const idResponsavel = unicunidade[0].fk_contato_id;
    const arrayResponsavel = contatos.find((i) => i.id_contato === idResponsavel);
    const nomeResponsavel = arrayResponsavel ? arrayResponsavel.nome_contato : '';

    setResponsavel(nomeResponsavel);
  };

  const handleClearUnidade = () => {
    setUnidadeId(null);
    setNomeUnidade(null);
    handleClearProcesso();
    handleClearRisco();
    handleClearSetor();
    setFilteredSetores([]);
  };

  // Função para atualizar o Setor
  const handleSetorSelect = async (SetorId, SetorName) => {
    closeModalSetor();
    setSetorId(SetorId);
    setSetorNome(SetorName);
    handleClearProcesso();

    const filteredProcessosSetores = setoresProcessos.filter((i) => i.fk_setor_id === SetorId);
    const IdsProcesso = filteredProcessosSetores.map((item) => item.fk_processo_id);
    const filteredProcessos = processos.filter((i) => IdsProcesso.includes(i.id_processo));

    setFilteredProcessos(filteredProcessos);
  };

  const handleClearSetor = () => {
    setSetorId(null);
    setSetorNome(null);
    handleClearProcesso();
    handleClearRisco();
    setFilteredProcessos([]);
  }

  // Função para atualizar o Processo
  const handleProcessoSelect = async (ProcessoId, ProcessoNome) => {
    closeModalProcesso();
    setProcessoId(ProcessoId);
    setProcessoNome(ProcessoNome);
    handleClearRisco();

    const filteredProcessosRiscos = processosRiscos.filter((i) => i.fk_processo_id === ProcessoId);
    const idsRiscos = filteredProcessosRiscos.map((item) => item.fk_risco_id);
    const filteredRiscos = riscos.filter((i) => idsRiscos.includes(i.id_risco));

    setFilteredRiscos(filteredRiscos);
  };

  const handleClearProcesso = () => {
    setProcessoId(null);
    setProcessoNome(null);
    handleClearRisco();
    setFilteredRiscos([]);
  };
  
  const verify = async (unidadeId, setorId, processoId, riscoId) => {
    try {
    
  
      // Faz uma requisição para verificar a existência da combinação
      const response = await fetch(`${connect}/plano/existe?unidadeId=${unidadeId}&setorId=${setorId}&processoId=${processoId}&riscoId=${riscoId}`);
      const data = await response.json();
  
      if (data.existeCombinação) {
        setIsOk(false);
        toast.error("Esta combinação de unidade, setor, processo e risco já está cadastrada.");
      } else {
        // Se a combinação não existe, prosseguir com outras ações
        setIsOk(true);
      }
    } catch (error) {
      console.error("Erro ao verificar a existência da combinação:", error);
      toast.error("Ocorreu um erro ao verificar a existência da combinação. Por favor, tente novamente mais tarde.");
    }
  };
  
  // Função para atualizar o Risco
  const handleRiscoSelect = async (RiscoId, RiscoNome) => {
    closeModalRisco();
    setRiscoId(RiscoId);
    setRiscoNome(RiscoNome);

    const filteresRiscosMedidas = riscosMedidas.filter((i) => i.fk_risco_id === RiscoId);

    const medidasTipos = filteresRiscosMedidas.map((filteredRiscosMedidas) => ({
      medidaId: filteredRiscosMedidas.fk_medida_id,
      medidaTipo: filteredRiscosMedidas.tipo,
    }));


    await handleRiscoEscolhido(RiscoId, medidasTipos);
  };

  const handleRiscoEscolhido = async (RiscoId, medidasTipos) => {
    try {
      if (onEdit) {
        return;
      }
  
      // Usar um array para acumular promessas para Promise.all, se aplicável
      const promises = [];
  
      for (const { medidaId, medidaTipo } of medidasTipos) {
        // Verificar se a combinação já existe
        const verificarResponse = await fetch(
          `${connect}/verificar_sprm?fk_setor_id=${setorId}&fk_processo_id=${processoId}&fk_risco_id=${RiscoId}&fk_medida_id=${medidaId}&tipo_medida=${medidaTipo}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
  
        if (!verificarResponse.ok) {
          throw new Error(`Erro ao verificar a existência. Status: ${verificarResponse.status}`);
        }
  
        const verificarData = await verificarResponse.json();
  
        // Se a combinação já existir, continue para a próxima iteração
        if (verificarData.existeCombinação) {
          continue;
        }
  
        // Adicionar a nova medida
        const adicionarResponse = await fetch(`${connect}/global_sprm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fk_setor_id: setorId,
            fk_processo_id: processoId,
            fk_risco_id: RiscoId,
            fk_medida_id: medidaId,
            tipo_medida: medidaTipo,
            status: 'Não Aplicavel',
          }),
        });
  
        if (!adicionarResponse.ok) {
          throw new Error(`Erro ao adicionar medida. Status: ${adicionarResponse.status}`);
        }
  
        const adicionarData = await adicionarResponse.json();

        promises.push(adicionarData); // Acumular promessa se for necessário
  
        // Atualizar global SPRM e verificar risco
        await getGlobalSprm();
        await verify(unidadeId, setorId, processoId, riscoId);
      }
  
      if (promises.length > 0) {
        await Promise.all(promises);
        toast.success("Medidas adicionadas com sucesso!");
      }
  
      setLoading(true);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao adicionar medidas", error);
    }
  };
  
  const handleClearRisco = () => {
    setRiscoId(null);
    setRiscoNome(null);
    setIsOk(false);
    setFilterGlobalSprm([]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nomeUnidade || !setorNome || !processoNome || !riscoNome || !data) {
      toast.warn("Preencha todos os campos!");
      return;
    }

    try {
      for (const medida of filteredMedidas) {
        const prazo = selectedPrazos[`${medida.id_medida}`];

        const planoData = {
          data: data || '',
          fk_empresa_id: companyId || '',
          fk_unidade_id: unidadeId || '',
          fk_setor_id: setorId || '',
          fk_processo_id: processoId || '',
          fk_risco_id: riscoId || '',
          fk_medida_id: medida.id_medida || '',
          tipo_medida: medida.tipo_medida || '',
          responsavel: responsavel || '',
          prazo: prazo || '',
          status: 'Não Realizado',
          data_conclusao: '',
        };
        const url = onEdit
          ? `${connect}/plano/${onEdit.id_plano}`
          : `${connect}/plano`;

        const method = onEdit ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(planoData),
        });

        if (!response.ok) {
          toast.error("Erro ao adicionar Plano de Ação!")
          throw new Error(`Erro ao adicionar Plano de Ação. Status: ${response.status}`)
        }

        const responseData = await response.json();

        toast.success(responseData);
      }
    } catch (error) {
      console.log("Erro ao inserir inventário: ", error);
    }

    handleClear();
  };

  const handleClear = () => {
    handleClearUnidade();
    setOnEdit(null);
    setIsOk(false);
    setData(obterDataFormatada);
    setFilterGlobalSprm([]);
  };

  const handleMedidaChange = () => {
    getGlobalSprm();
    closeModalMedidas();
  };

  const handleFilterGlobalSprm = () => {
    const sprm = globalSprm.filter((i) => i.fk_setor_id === setorId && i.fk_processo_id === processoId && i.fk_risco_id === riscoId);
    const filterApply = sprm.filter((c) => c.status && c.status !== "Aplica");
    setFilterGlobalSprm(filterApply);
  };

  const handleChangeData = (event) => {
    setData(event.target.value);
  };

  const handlePrazoChange = (event, id) => {
    setIsOk(false);
    setSelectedPrazos((prevPrazos) => ({
      ...prevPrazos,
      [id]: onEdit ? event.target.value : event.target.value,
    }));

    const prazosValues = Object.values({
      ...selectedPrazos,
      [id]: onEdit ? event.target.value : event.target.value,
    });

    const allPrazosSelected = prazosValues.every((prazo) => prazo !== '0');
    if (allPrazosSelected) {
      setIsOk(true);
    };
  }


  return (
    <>
      {loading && <LoadingScreen />}
      <div className="flex justify-center">
        <form className="w-full max-w-7xl" ref={user} onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-3 mb-6 p-3">

            {/* Unidade */}
            <div className="w-full md:w-1/4 px-3">
              <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-fk_contato_id">
                Unidade:
              </label>
              <div className="flex items-center w-full">
                {nomeUnidade ? (
                  <>
                    <button
                      className="flex appearance-none hover:shadow-sm text-sky-600 bg-gray-100 border-gray-200 mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text"
                      onClick={openModalUnidade}
                      type="button"
                    >
                      <p className="font-bold">
                        {nomeUnidade}
                      </p>
                    </button>
                    <button className="ml-4" onClick={handleClearUnidade} type="button">
                      <img src={icon_sair} alt="" className="h-9" />
                    </button>
                  </>
                ) : (
                  <button
                    className="flex w-full appearance-none text-gray-400 bg-gray-100 border-gray-200 justify-center mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text"
                    onClick={openModalUnidade}
                    type="button"
                  >
                    <p className="text-sm font-medium">
                      Nenhuma Unidade Selecionado
                    </p>
                  </button>
                )}
                <button
                  type="button"
                  onClick={openModalUnidade}
                  className={`flex cursor-pointer ml-4`}
                >
                  <img src={icon_lupa} className="h-9" alt="Icone adicionar unidade"></img>
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
            <div className="w-full md:w-1/4 px-3">
              <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-fk_contato_id">
                Setor:
              </label>
              <div className="flex items-center w-full">
                {setorNome ? (
                  <>
                    <button
                      className="flex appearance-none hover:shadow-sm text-sky-600 bg-gray-100 border-gray-200 justify-center mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text"
                      onClick={openModalSetor}
                      type="button"

                    >
                      <p className="font-bold">
                        {setorNome}
                      </p>
                    </button>
                    <button className="ml-4" onClick={handleClearSetor} type="button"
                    >
                      <img src={icon_sair} alt="" className="h-9" />
                    </button>
                  </>
                ) : (
                  <button
                    className="flex w-full appearance-none text-gray-400 bg-gray-100 border-gray-200 justify-center mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text"
                    onClick={openModalSetor}
                    type="button"
                  >
                    <p className="px-2 text-sm font-medium">
                      Nenhum Setor Selecionado
                    </p>
                  </button>
                )}

                <button
                  type="button"
                  onClick={openModalSetor}
                  className={`flex cursor-pointer ml-4`}
                >
                  <img src={icon_lupa} className="h-9" alt="Icone adicionar unidade"></img>
                </button>
              </div>
              <ModalSearchSetor
                isOpen={showModalSetor}
                onCancel={closeModalSetor}
                children={filteredSetores}
                onContactSelect={handleSetorSelect}
              />
            </div>
            {/* Processo */}
            <div className="w-full md:w-1/4 px-3">
              <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-fk_contato_id">
                Processo:
              </label>
              <div className="flex items-center w-full">
                {processoNome ? (
                  <>
                    <button
                      className="flex appearance-none hover:shadow-sm text-sky-600 bg-gray-100 border-gray-200 justify-center mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text"
                      onClick={openModalProcesso}
                      type="button"

                    >
                      <p className="font-bold">
                        {processoNome}
                      </p>
                    </button>
                    <button className="ml-4" onClick={handleClearProcesso} type="button"
                    >
                      <img src={icon_sair} alt="" className="h-9" />
                    </button>
                  </>
                ) : (
                  <button
                    className="flex w-full appearance-none text-gray-400 bg-gray-100 border-gray-200 justify-center mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text"
                    onClick={openModalProcesso}
                    type="button"

                  >
                    <p className="px-2 text-sm font-medium">
                      Nenhum Processo Selecionado
                    </p>
                  </button>
                )}

                <button
                  type="button"
                  onClick={openModalProcesso}
                  className={`flex cursor-pointer ml-4`}
                >
                  <img src={icon_lupa} className="h-9" alt="Icone adicionar Processo"></img>
                </button>
              </div>
              <ModalSearchProcesso
                isOpen={showModalProcesso}
                onCancel={closeModalProcesso}
                children={filteredProcessos}
                setorName={setorNome}
                onSetorSelect={handleProcessoSelect}
              />
            </div>
            {/* Risco */}
            <div className="w-full md:w-1/4 px-3">
              <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-fk_contato_id">
                Risco:
              </label>
              <div className="flex items-center w-full">
                {riscoNome ? (
                  <>
                    <button
                      className="flex appearance-none hover:shadow-sm text-sky-600 bg-gray-100 border-gray-200 justify-center py-3 px-4 rounded leading-tight focus:outline-none with-text"

                      onClick={openModalRisco}
                      type="button"
                    >
                      <p className="font-bold">
                        {riscoNome}
                      </p>
                    </button>
                    <button className="ml-4" onClick={handleClearRisco} type="button"
                    >
                      <img src={icon_sair} alt="" className="h-9" />

                    </button>
                  </>
                ) : (
                  <button
                    className="flex w-full appearance-none text-gray-400 bg-gray-100 border-gray-200 justify-center py-3 px-4 rounded leading-tight focus:outline-none with-text"
                    onClick={openModalRisco}
                    type="button"

                  >
                    <p className="px-2 text-sm font-medium">
                      Nenhum Risco Selecionado
                    </p>
                  </button>
                )}

                <button
                  type="button"
                  onClick={openModalRisco}
                  className={`flex cursor-pointer ml-4`}
                >
                  <img src={icon_lupa} className="h-9" alt="Icone adicionar Risco"></img>
                </button>
              </div>
              <ModalSearchRisco
                isOpen={showModalRisco}
                onCancel={closeModalRisco}
                children={filteredRiscos}
                setorName={riscoNome}
                onSelect={handleRiscoSelect}
              />
            </div>

            {/* Data */}
            <div className="w-full md:w-1/4 px-3">
              <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-raza_social">
                Data:
              </label>
              <input
                className={`appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white`}
                type="date"
                name="data_inventario"
                value={data}
                onChange={handleChangeData}
              />
            </div>

            {/* Medidas de Controle */}
            <div className="w-full md:w-1/4 px-3">
              <label className="tracking-wide text-gray-700 text-xs font-bold" htmlFor="grid-raza_social">
                Medidas de Controle:
              </label>
              <div>
                <button
                  type="button"
                  className="w-full mt-1 bg-gray-100 px-4 py-2 hover:bg-gray-200 font-semibold text-base rounded-md text-sky-700"
                  onClick={openModalMedidas}
                >
                  Defina as Medidas
                </button>
              </div>
              <ModalMedidasDefine
                isOpen={showModalMedidas}
                onCancel={closeModalMedidas}
                companyName={companyName}
                globalSprm={filterGlobalSprm}
                medidas={medidas}
                medidasDefine={handleMedidaChange}
                plano={plano}
                getGlobalSprm={getGlobalSprm}
              />
            </div>
            {/* Medidas de Controle Aplicadas*/}
            <div className="w-full md:w-2/4 px-3">
              <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-raza_social">
                Medidas Não Aplicadas:
              </label>
              {riscoId && filteredMedidas.length > 0 && filteredMedidas.map((item, i) => (
                <ul key={i}>
                  <li className="pb-3 sm:pb-4">
                    <div className="grid grid-cols-5 items-center space-x-4 rtl:space-x-reverse border-b border-gray-300 px-4 py-2 hover:bg-gray-50">
                      <div className="flex-1 min-w-0 pr-4 col-span-2">
                        <p className="text-sm font-medium text-gray-900 whitespace-break-spaces truncate">
                          {item.descricao_medida}
                        </p>
                      </div>
                      <div className="inline-flex justify-center items-center text-base font-semibold text-gray-900">
                        {item.grupo_medida}
                      </div>
                      <div className="inline-flex justify-center col-span-2 items-center text-base text-gray-800">
                        <select
                          className="appearence-none bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight cursor-pointer"
                          type="text"
                          name="prazo_medida"
                          value={selectedPrazos[`${item.id_medida}`] || '0'
                          }
                          onChange={(e) => handlePrazoChange(e, item.id_medida)}
                        >
                          <option value="0">Selecione um Prazo</option>
                          <option value="6 Meses">6 Meses</option>
                          <option value="12 Meses">12 Meses</option>
                          <option value="24 Meses">24 Meses</option>
                        </select>
                      </div>
                    </div>
                  </li>
                </ul>
              ))}
            </div>

            {/* Buttons */}
            <div className="w-full px-3 pl-8 flex justify-end">
              <div className="px-3 pl-8">
                <button onClick={() => handleClear()} className="shadow mt-4 bg-red-600 hover:bg-red-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
                  Limpar
                </button>
              </div>
              <div className="px-3 pl-8">
                <button
                  className={`shadow mt-4 bg-green-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ${isOk ? 'hover:bg-green-700' : 'opacity-50 cursor-not-allowed'}`}
                  type="submit"
                  disabled={isOk}
                >
                  Adicionar
                </button>
              </div>
            </div>

          </div>
        </form >
      </div >
    </>
  );
}

export default FrmPlano;