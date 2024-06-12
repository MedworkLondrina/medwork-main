import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { connect } from "../../../services/api";

import LoadingScreen from "../../pages/subPages/components/LoadingScreen";
import ModalSetorExame from "../../pages/subPages/components/Modal/ModalSetorExame";
import ModalSetorProcesso from "../../pages/subPages/components/Modal/ModalSetorProcesso";
import ModalProcessoRisco from "../../pages/subPages/components/Modal/ModalProcessoRisco";
import ModalRiscoMedida from "../../pages/subPages/components/Modal/ModalRiscoMedidas";

import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { IoAddCircle } from "react-icons/io5";
import { BsTrash3Fill } from "react-icons/bs";
import icon_alerta from "../../media/icons_sup/icon_alerta.png";
import icon_perigo from "../../media/icons_sup/icon_perigo.png";
import icon_processo from '../../media/menu/icon_processo.svg';
import icon_risco from '../../media/menu/icon_risco.svg';
import icon_exame from '../../media/menu/icon_exame.svg';

function ProfileCompany({ companyId, empresas, contatos }) {
  const {
    fetchUnidades,
    fetchSetores,
    fetchCargos,
    getSetoresProcessos,
    getProcessos,
    getProcessosRiscos,
    getRiscos,
    getRiscosMedidas,
    fetchMedidas,
    fetchCnae,
    getExames,
    getSetoresExames,
    fetchProcessoCnae,
  } = useAuth(null);

  const [company, setCompany] = useState([]);
  const [contact, setContact] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [showUnidade, setShowUnidade] = useState(false);
  const [showUnidadeData, setShowUnidadeData] = useState([]);
  const [contatoUnidade, setContatoUnidade] = useState([]);
  const [showSetores, setShowSetores] = useState(false);
  const [showSetorData, setShowSetorData] = useState(false);
  const [setoresData, setSetoresData] = useState([]);
  const [selectedSetor, setSelectedSetor] = useState([]);
  const [selectedProcesso, setSelectedProcesso] = useState([]);
  const [selectedRisco, setSelectedRisco] = useState([]);
  const [cargosData, setCargosData] = useState([]);
  const [processosData, setProcessosData] = useState([]);
  const [riscosData, setRiscosData] = useState([]);
  const [medidasData, setMedidasData] = useState([]);
  const [setorSelecionado, setSetorSelecionado] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRisco, setLoadingRisco] = useState(false);
  const [loadingMedida, setLoadingMedida] = useState(false);
  const [showRiscosProc, setShowRiscosProc] = useState(false);
  const [showMedidasRisk, setShowMedidasRisk] = useState(false);
  const [selectedProcessoId, setSelectedProcessoId] = useState(null);
  const [selectedRiscoId, setSelectedRiscoId] = useState(null);
  const [cnaes, setCnaes] = useState([]);

  const [activeTab, setActiveTab] = useState(1);

  const [exames, setExames] = useState([]);
  const [filteredExames, setFilteredExames] = useState([]);

  const [showModalSetorProcesso, setShowModalSetorProcesso] = useState(false);
  const [showModalSetorExame, setShowModalSetorExame] = useState(false);
  const [showModalProcessoRisco, setShowModalProcessoRisco] = useState(false);
  const [showModalRiscoMedida, setShowModalRiscoMedida] = useState(false);

  const filter = () => {
    const findCompany = empresas.find((item) => item.id_empresa === companyId);
    const findContato = contatos.find(
      (item) => item.id_contato === findCompany.fk_contato_id
    );
    setCompany(findCompany);
    setContact(findContato);
  };

  const getUnidades = async () => {
    const units = await fetchUnidades();
    setUnidades(units);
  };

  useEffect(() => {
    filter();
    getUnidades();
  }, []);

  const handleSelectUnidade = async (item) => {
    try {
      setShowSetorData(false);

      const und = unidades.find((i) => i.id_unidade === item);
      if (und) {
        const filterContato = contatos.find(
          (i) => i.id_contato === und.fk_contato_id
        );
        setContatoUnidade(filterContato);
        setShowUnidadeData(und);
        setShowUnidade(true);
      } else {
        setShowUnidadeData(null);
        setShowUnidade(false);
      }

      const sector = await fetchSetores();
      if (sector) {
        const filteredSetores = sector.filter((i) => i.fk_unidade_id === item);
        setSetoresData(filteredSetores);
      } else {
        console.error("Nenhum setor encontrado para as unidades filtradas.");
      }
      setShowSetores(true);
    } catch (error) {
      console.error(`Erro ao buscar setores. Status ${error}`);
    }
  };

  const handleSelectSetor = async (idSetor) => {
    if (setorSelecionado !== idSetor) {
      setShowRiscosProc(false);
      setShowMedidasRisk(false);
      setLoading(true);
      setSelectedSetor([]);
      setShowSetorData(true);
      setSetorSelecionado(idSetor);
      setActiveTab(1);
      
      await carregarInformações(idSetor);
      
      // Verifica se o setor possui riscos antes de adicionar exames automaticamente
      const riscos = await getProcessosRiscos();
      const setorRiscos = riscos.filter(risco => risco.fk_setor_id === idSetor);
      
      if (setorRiscos.length > 0) {
        await handleAdicionarExameAutomaticamente();
      }
      
      setLoading(false);
    } else {
      setActiveTab(1);
      setSetorSelecionado("");
      setShowSetorData(false);
    }
  };

  const carregarInformações = async (item) => {
    try {
      setLoading(true);

      const filteredExames = await getSetoresExames(item)
      setExames(filteredExames)


      const sector = setoresData.find((i) => i.id_setor === item);
      setSelectedSetor(sector);

      if (sector) {
        const setProc = await getSetoresProcessos();
        const proc = await getProcessos();
        const filterSetProc = setProc.filter(
          (i) => i.fk_setor_id === sector.id_setor
        );
        const procMap = filterSetProc.map((i) => i.fk_processo_id);
        const filteredProcessos = proc.filter((i) =>
          procMap.includes(i.id_processo)
        );
        const orderProcessos = filteredProcessos.sort(
          (a, b) => b.id_processo - a.id_processo
        );
        setProcessosData(orderProcessos);

        findCnaes(procMap);
      } else {
        setSelectedSetor(null);
        setShowSetorData(false);
      }
      setLoading(false);
    } catch (error) {
      console.error(`Erro ao buscar setores. Status ${error}`);
    }
  };

  const handleAdicionarExameAutomaticamente = async () => {
    try {
      // Obter os processos de risco
      const procRisc = await getProcessosRiscos();
      
     
        // Mapear os IDs de risco
        const testeRisc = procRisc.map(i => i.fk_risco_id);
        
        // Construir o corpo da requisição
        const requestBody = {
          setorId: selectedSetor.id_setor,
          riscoIds: testeRisc
        };
  

  
        // Fazer a requisição
        const response = await fetch(`${connect}/exames_setores_from_riscos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
  
        // Verificar a resposta
        if (response.ok) {
          carregarInformações(selectedSetor.id_setor);
          console.log('Exames vinculados ao setor com sucesso');
        } else {
          console.error('Falha ao vincular exames ao setor.');
        }

    } catch (error) {
      console.error('Erro ao adicionar exame automaticamente:', error);
    }
  };
  

  const carregarRiscos = async (idProcesso, setorId) => {
    try {
      setLoadingRisco(true);
      const procRisc = await getProcessosRiscos();
      const risc = await getRiscos();

      // Filtrar os riscos apenas para o processo específico
      const filterProcRisco = procRisc.filter(
        (i) => i.fk_processo_id === idProcesso
      );
      const riscIds = filterProcRisco.map((i) => i.fk_risco_id);

      const testeRisc = procRisc.map(i => i.fk_risco_id);


      // Fazer a requisição POST usando fetch

      const filteredRiscos = risc.filter((i) => riscIds.includes(i.id_risco));
      const orderRiscos = filteredRiscos.sort((a, b) => b.id_risco - a.id_risco);
      setRiscosData(orderRiscos);
      setLoadingRisco(false);
    } catch (error) {
      console.error('Erro ao enviar requisição POST:', error);
      setLoadingRisco(false);
    }
  };

  const carregarMedidas = async (idRisco) => {
    try {
      setLoadingMedida(true);
      const riscMed = await getRiscosMedidas();
      const med = await fetchMedidas("all");

      // Filtrar as medidas apenas para o risco específico
      const filterRiscMed = riscMed.filter((i) => i.fk_risco_id === idRisco);
      const medIds = filterRiscMed.map((i) => i.fk_medida_id);
      const filteredMedidas = med.filter((i) => medIds.includes(i.id_medida));

      const orderMedidas = filteredMedidas.sort(
        (a, b) => b.id_medida - a.id_medida
      );
      setMedidasData(orderMedidas);
      setLoadingMedida(false);
    } catch (error) {
      console.error(`Erro ao carregar medidas. Status: ${error}`);
    }
  };

  const carregarExames = async () => {
    try {
      setLoading(true);
      const exam = await getExames();
      const setorExames = await getSetoresExames(selectedSetor.id_setor);
      setExames(exam);
      setFilteredExames(setorExames);
      setLoading(false);
    } catch (error) {
      console.error(`Erro ao carregar exames. Status: ${error}`);
    }
  };

  const carregarCargos = async () => {
    try {
      setLoading(true);
      const offices = await fetchCargos();
      const filteredCargos = offices.filter((i) => i.fk_setor_id === selectedSetor.id_setor);
      const orderCargos = filteredCargos.sort(
        (a, b) => b.id_cargo - a.id_cargo
      );
      setCargosData(orderCargos);
      setLoading(false);
    } catch (error) {
      console.error(`Erro ao carregar cargos. Status: ${error}`);
    }
  };

  const handleClickProcesso = async (idProcesso) => {
    if (selectedProcessoId !== idProcesso) {
      await carregarRiscos(idProcesso);
      setShowRiscosProc(true);
      setSelectedProcessoId(idProcesso);
    } else {
      setShowRiscosProc(false);
      setSelectedProcessoId("");
    }
  };

  const handleClickMedidas = async (idRisco) => {
    if (selectedRiscoId !== idRisco) {
      await carregarMedidas(idRisco);
      setShowMedidasRisk(true);
      setSelectedRiscoId(idRisco);
    } else {
      setShowMedidasRisk(false);
      setSelectedRiscoId("");
    }
  };

  const typeMedida = (item) => {
    switch (item) {
      case "MI":
        return "Individual";
      case "MA":
        return "Administrativa";
      case "MC":
        return "Coletiva";
      case "TR":
        return "Treinamento";
      case "IN":
        return "Inspeção";
      case "MG":
        return "Geral";

      default:
        return "N/A";
    }
  };

  const handleAdicionarProcesso = () => {
    openModalSetorProcesso();
  };

  const handleAdicionarExame = () => {
    openModalSetorExame();
  };

  const handleAdicionarRisco = (processo) => {
    setSelectedProcesso(processo);
    openModalProcessoRisco();
  };

  const handleAdicionarMedida = (risco) => {
    setSelectedRisco(risco);
    openModalRiscoMedida();
  };

  const findCnaes = async (processosIds) => {
    try {
      const cnaes = await fetchCnae();
      const procCnae = await fetchProcessoCnae();

      const filteredProcCnaes = procCnae.filter((i) =>
        processosIds.includes(i.fk_processo_id)
      );

      const cnaesComProcesso = filteredProcCnaes.map((item) => {
        const cnae = cnaes.find((cnae) => cnae.id_cnae === item.fk_cnae_id);
        return {
          ...cnae,
          id_processo: item.fk_processo_id,
        };
      });

      setCnaes(cnaesComProcesso);
    } catch (error) {
      console.error(`Erro ao buscar cnaes dos processos. Status: ${error}`);
    }
  };

  // Controle Modais
  const openModalSetorProcesso = () => setShowModalSetorProcesso(true);
  const openModalProcessoRisco = () => setShowModalProcessoRisco(true);
  const openModalSetorExame = () => setShowModalSetorExame(true);
  const openModalRiscoMedida = () => setShowModalRiscoMedida(true);

  const closeModalSetorProcesso = async () => {
    setShowModalSetorProcesso(false);
    await carregarInformações(selectedSetor.id_setor);
  };

  const closeModalSetorExame = async () => {
    setShowModalSetorExame(false);
    await carregarExames();
  };

  const closeModalProcessoRisco = async () => {
    setShowModalProcessoRisco(false);
    await carregarRiscos(selectedProcesso.id_processo);
    setSelectedProcessoId(selectedProcesso.id_processo);
    setShowRiscosProc(true);
  };
  const closeModalRiscoMedida = async () => {
    setShowModalRiscoMedida(false);
    await carregarMedidas(selectedRisco.id_risco);
    setSelectedRiscoId(selectedRisco.id_risco);
    setShowMedidasRisk(true);
  };

  const handleDeleteProcesso = async (idProcesso) => {
    try {
      const result = await Swal.fire({
        title: "Tem certeza?",
        text: "Você está prestes a excluir este item!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, exclua!",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      });
      if (result.isConfirmed) {
        const setProc = await getSetoresProcessos();
        const filterProc = setProc.filter(
          (item) =>
            item.fk_setor_id === selectedSetor.id_setor &&
            item.fk_processo_id === idProcesso
        );
        const response = await fetch(
          `${connect}/setores_processos/${filterProc[0].id_setor_processo}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Erro ao deletar vinculo entre processo e setor. Status: ${response.status}`
          );
        }

        const responseData = await response.json();
        toast.success(responseData.message);
        carregarInformações(selectedSetor.id_setor);
      }
    } catch (error) {
      console.error(`Erro ao deletar processo e setor. Status: ${error}`);
    }
  };

  const handleDeleteRisco = async (idRisco) => {
    try {
      const result = await Swal.fire({
        title: "Tem certeza?",
        text: "Você está prestes a excluir este item!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, exclua!",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      });
      if (result.isConfirmed) {
        const procRisc = await getProcessosRiscos();
        const filterRisc = procRisc.filter(
          (item) =>
            item.fk_processo_id === selectedProcessoId &&
            item.fk_risco_id === idRisco
        );
        const response = await fetch(
          `${connect}/processos_riscos/${filterRisc[0].id_processo_risco}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Erro ao deletar vinculo entre risco e processo. Status: ${response.status}`
          );
        }

        const responseData = await response.json();
        toast.success(responseData.message);
        carregarRiscos(selectedProcessoId);
      }
    } catch (error) {
      console.error(
        `Erro ao deletar vinculo entre risco e processo. Status: ${error}`
      );
    }
  };

  const handleDeleteMedida = async (idMedida) => {
    try {
      const result = await Swal.fire({
        title: "Tem certeza?",
        text: "Você está prestes a excluir este item!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, exclua!",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      });
      if (result.isConfirmed) {
        const riscMed = await getRiscosMedidas();
        const filterMed = riscMed.filter(
          (item) =>
            item.fk_risco_id === selectedRiscoId &&
            item.fk_medida_id === idMedida
        );
        const response = await fetch(
          `${connect}/riscos_medidas/${filterMed[0].id_risco_medida}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Erro ao deletar vinculo entre medida e risco. Status: ${response.status}`
          );
        }

        const responseData = await response.json();
        toast.success(responseData.message);
        carregarMedidas(selectedRiscoId);
      }
    } catch (error) {
      console.error(
        `Erro ao deletar vinculo entre medida e risco. Status: ${error}`
      );
    }
  };

  const handleDeleteExame = async (idExame) => {
    try {
      const result = await Swal.fire({
        title: "Tem certeza?",
        text: "Você está prestes a excluir este item!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, exclua!",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      });
      if (result.isConfirmed) {
        const queryParams = new URLSearchParams({ id_setor: selectedSetor.id_setor, id_exame: idExame }).toString();
        const response = await fetch(
          `${connect}/setor_exame/?${queryParams}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Erro ao deletar vinculo entre exame e setor. Status: ${response.status}`
          );
        }

        const responseData = await response.json();
        toast.success(responseData.message);
        carregarExames(selectedSetor.id_setor);
      }
    } catch (error) {
      console.error(
        `Erro ao deletar vinculo entre exame e setor. Status: ${error}`
      );
    }
  };

  const renderContent = async (tab) => {
    switch (tab) {
      case 1:
        setActiveTab(1);
        await carregarInformações(selectedSetor.id_setor);
        break
      case 2:
        setActiveTab(2);
        await carregarExames();
        break;
      case 3:
        setActiveTab(3);
        await carregarCargos();
        break
      default:
        return null;
    }
  };

  if (!companyId) {
    return;
  };

  return (
    <>
      <div className="h-fit">
        {/* Company Card */}
        <div className="w-full bg-sky-600 shadow-md px-4 py-4 rounded-xl">
          <div className="px-4 grid grid-cols-3">
            <div className="col-span-2">
              <h2 className="text-white font-extrabold text-2xl truncate">
                {company.nome_empresa}
              </h2>
              <p className="text-white font-light text-sm truncate -mt-1 mb-1">
                Razão Social:{" "}
                <span className="text-lg font-medium truncate">
                  {company.razao_social}
                </span>
              </p>
              <p className="text-white">Contato:</p>
            </div>
            <div className="col-span-1 text-right px-2">
              <h2 className="text-white font-extrabold text-2xl truncate">
                {company.cnpj_empresa}
              </h2>
            </div>
          </div>
          <div className="px-4">
            <div className="bg-white rounded-sm px-3 inline-block">
              <p className="text-sky-600 font-semibold">
                {contact ? contact.nome_contato : ""} -{" "}
                <span className="text-sm text-gray-700 font-light">
                  {contact ? contact.email_contato : ""}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Tab Unidades */}
        {unidades && (
          <>
            <div className="pt-2 px-3 overflow-x-auto">
              <div className="flex items-center gap-2 border-b border-gray-300">
                <h1 className="font-medium text-gray-600">
                  Unidades:
                </h1>
                <ul className="flex -mb-px">
                  {unidades.map((item) => (
                    <li
                      key={item.id_unidade}
                      onClick={() => handleSelectUnidade(item.id_unidade)}
                    >
                      <div
                        className={`inline-block py-3 px-4 border-b-2 border-transparent rounded-t-lg ${showUnidadeData.id_unidade === item.id_unidade
                          ? "text-sky-600 bg-gray-100"
                          : "hover:bg-gray-100 hover:text-sky-600 hover:border-b-2 hover:border-sky-600 cursor-pointer"
                          }`}
                      >
                        <p className="text-sm font-medium text-center text-gray-500 cursor-pointer">
                          {item.nome_unidade}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* Setores */}
        {showSetores && (
          <div className="w-full py-4 px-6 bg-gray-100">
            {/* Card Unidades */}
            {showUnidade && (
              <>
                <div className="w-full bg-white shadow px-4 py-2 rounded-md mb-4">
                  <div className="grid grid-cols-3">
                    <div className="col-span-2">
                      <h2 className="text-sky-700 font-bold text-xl truncate">
                        {showUnidadeData.nome_unidade}
                      </h2>
                      <p className="truncate text-gray-800 font-medium">
                        {showUnidadeData.endereco_unidade},{" "}
                        {showUnidadeData.numero_unidade}{" "}
                        {showUnidadeData.complemento_unidade} -{" "}
                        {showUnidadeData.cidade_unidade}/
                        {showUnidadeData.uf_unidade}
                      </p>
                      <div className="flex items-center gap-1">
                        <p className="text-gray-600 text-sm font-light">
                          Contato:
                        </p>
                        <p className="text-sky-700 font-semibold truncate">
                          {contatoUnidade ? contatoUnidade.nome_contato : ""}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 text-right px-2">
                      <h2 className="text-sky-700 font-bold text-2xl truncate">
                        {showUnidadeData.cnpj_unidade}
                      </h2>
                    </div>
                  </div>
                </div>
              </>
            )}

            {setoresData && (
              <div className="w-full grid grid-cols-3">
                {/* Lista de Setores */}
                <div className="col-span-1">
                  <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
                    <ul class="flex">
                      <li class="me-2">
                        <div class={`ml-2 py-1 border-b-2 border-transparent`}>
                          <p>Lista de Setores</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <ul className="space-y-4">
                    {setoresData.map((item) => (
                      <li
                        className="cursor-pointer"
                        key={item.id_setor}
                        onClick={() => handleSelectSetor(item.id_setor)}
                      >
                        <div
                          className={`bg-white px-4 py-2 ${showSetorData
                            ? "rounded-l-md"
                            : "rounded-md shadow hover:shadow-md"
                            }`}
                        >
                          <h2 className="text-sky-700 font-bold text-lg truncate">
                            {item.nome_setor}
                          </h2>
                          <div className="border-b border-gray-200 mb-2"></div>
                          <p className="truncate text-gray-700 text-sm">
                            {item.ambiente_setor}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Setor Selecionado */}
                <div className="col-span-2">
                  {showSetorData && (
                    <>
                      {/* Tab */}
                      <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
                        <ul class="flex">
                          <li class="me-2" onClick={() => renderContent(1)}>
                            <div class={`inline-block px-4 py-1 border-b-2 rounded-t-lg ${activeTab === 1 ? 'text-sky-700 border-sky-600' : 'hover:text-sky-700 hover:border-sky-600 border-transparent'}  cursor-pointer`}>
                              <p className="cursor-pointer">Processos</p>
                            </div>
                          </li>
                          <li class="me-2" onClick={() => renderContent(2)}>
                            <div class={`inline-block px-4 py-1 border-b-2 rounded-t-lg ${activeTab === 2 ? 'text-sky-700 border-sky-600' : 'hover:text-sky-700 hover:border-sky-600 border-transparent'}  cursor-pointer`}>
                              <p className="cursor-pointer">Exames</p>
                            </div>
                          </li>
                          <li class="me-2" onClick={() => renderContent(3)}>
                            <div class={`inline-block px-4 py-1 border-b-2 rounded-t-lg ${activeTab === 3 ? 'text-sky-700 border-sky-600' : 'hover:text-sky-700 hover:border-sky-600 border-transparent'}  cursor-pointer`}>
                              <p className="cursor-pointer">Cargos</p>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-r-md px-4 py-2 relative">
                        {loading && <LoadingScreen />}
                        <div>

                          {/* Cargos */}
                          {activeTab === 3 && cargosData && (
                            <ul className="space-y-2">
                              {cargosData.map((item) => (
                                <li key={item.id_cargo}>
                                  <div className="bg-gray-50 rounded px-4 py-2">
                                    <div>
                                      <h2 className="text-sky-700 text font-medium truncate hover:whitespace-normal">
                                        {item.nome_cargo}
                                      </h2>
                                    </div>
                                    <hr />
                                    <div className="mt-1">
                                      <p className="text-sm text-gray-700 text-justify">
                                        <span className="text-sm font-light text-gray-500 text mr-1">Descrição:</span>{item.descricao}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                          {/* Exames */}
                          {activeTab === 2 && (
                            <>
                              <div className="">
                                <ul className="space-y-2 mb-2">
                                  {/* Adicionar Exame */}
                                  <li
                                    className="cursor-pointer"
                                    onClick={handleAdicionarExame}
                                  >
                                    <div className="bg-gray-50 rounded px-4 py-2 hover:bg-gray-100 hover:shadow">
                                      <div className="flex justify-center items-center text-sky-700 font-bold text-center gap-1">
                                        <IoAddCircle />
                                        <p className="">Adicionar Exame</p>
                                      </div>
                                    </div>
                                  </li>
                                  {/* Lista de Exames */}
                                  {exames && filteredExames.map((item, i) => (
                                    <li key={i}>
                                      <div className="bg-gray-50 rounded px-4 py-2">
                                        <div>
                                          <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-700 font-light -mb-1">
                                              Exame:
                                            </p>
                                            <div
                                              className="text-sm text-red-600 hover:text-red-700 cursor-pointer"
                                              onClick={() =>
                                                handleDeleteExame(item.id_exame)
                                              }
                                            >
                                              <BsTrash3Fill />
                                            </div>
                                          </div>
                                          <h2 className="text-sky-700 font-medium truncate hover:whitespace-normal">
                                            {item.nome_exame}
                                          </h2>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          )}

                          {/* Processos */}
                          {activeTab === 1 && (
                            <>
                              <div className="">
                                <ul className="space-y-2 mb-2">
                                  {/* Adicionar Processos */}
                                  <li
                                    className="cursor-pointer"
                                    onClick={handleAdicionarProcesso}
                                  >
                                    <div
                                      className={`bg-gray-50 rounded px-4 py-2 hover:bg-gray-100 hover:shadow`}
                                    >
                                      <div className="flex justify-center items-center text-sky-700 font-bold text-center gap-1">
                                        <IoAddCircle />
                                        <p className="">Adicionar Processos</p>
                                      </div>
                                    </div>
                                  </li>
                                  {/* Lista de Processos */}
                                  {processosData.map((item) => (
                                    <li key={item.id_processo}>
                                      <div
                                        className={`bg-gray-50 rounded px-4 py-2`}
                                      >
                                        <div>
                                          <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-700 font-light -mb-1">
                                              Processo:
                                            </p>
                                            <div
                                              className="text-sm text-red-600 hover:text-red-700 cursor-pointer"
                                              onClick={() =>
                                                handleDeleteProcesso(
                                                  item.id_processo
                                                )
                                              }
                                            >
                                              <BsTrash3Fill />
                                            </div>
                                          </div>
                                          <h2 className="text-sky-700 font-medium truncate hover:whitespace-normal">
                                            {item.nome_processo}
                                          </h2>
                                          <div>
                                            <p className="text-sm text-gray-700 font-light">
                                              Cnae's:
                                            </p>
                                            <div className="flex gap-2 mb-2">
                                              {cnaes
                                                .filter(
                                                  (cnae) =>
                                                    cnae.id_processo ===
                                                    item.id_processo
                                                )
                                                .map((cnae, i) => (
                                                  <div key={i} className="bg-white px-2 py-1 rounded">
                                                    <p
                                                      key={i.id_cnae}
                                                      className="text-sky-700 font-medium truncate hover:whitespace-normal"
                                                    >
                                                      {cnae.subclasse_cnae}
                                                    </p>
                                                  </div>
                                                ))}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="border-b border-sky-600"></div>
                                        <div
                                          className={`relative cursor-pointer rounded px-2 bg-white hover:shadow py-1 mt-1 ${showRiscosProc &&
                                            selectedProcessoId === item.id_processo
                                            ? "shadow"
                                            : ""
                                            }`}
                                        >
                                          {loadingRisco && <LoadingScreen />}
                                          <div
                                            className="flex items-center justify-between mt-1 mb-1"
                                            onClick={() =>
                                              handleClickProcesso(item.id_processo)
                                            }
                                          >
                                            <p className="text-sm">Riscos</p>
                                            {/* Mostrar Riscos */}
                                            <div className="flex gap-2 items-center">
                                              {showRiscosProc &&
                                                selectedProcessoId ===
                                                item.id_processo ? (
                                                <>
                                                  <IoIosArrowUp />
                                                </>
                                              ) : (
                                                <>
                                                  <IoIosArrowDown />
                                                </>
                                              )}
                                            </div>
                                          </div>
                                          <ul className="space-y-2 mb-2">
                                            {/* Adicionar Riscos */}
                                            {/* Lista de Riscos */}
                                            {showRiscosProc &&
                                              selectedProcessoId ===
                                              item.id_processo && (
                                                <>
                                                  <li
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                      handleAdicionarRisco(item)
                                                    }
                                                  >
                                                    <div className="bg-white border rounded px-3 py-1 hover:shadow">
                                                      <div className="flex justify-center items-center text-sky-700 font-bold gap-1">
                                                        <IoAddCircle />
                                                        <p>Adicionar Riscos</p>
                                                      </div>
                                                    </div>
                                                  </li>
                                                  {riscosData.map((risco) => (
                                                    <div
                                                      key={risco.id_risco}
                                                      className="bg-white border rounded px-3 py-2 mb-4"
                                                    >
                                                      <div className="grid grid-cols-3">
                                                        <div className="col-span-2">
                                                          <div>
                                                            <p className="text-gray-600 font-thin text-xs -mb-1">
                                                              Risco:
                                                            </p>
                                                            <p className="text-gray-600 font-bold text-lg">
                                                              {risco.nome_risco}
                                                            </p>
                                                          </div>
                                                        </div>
                                                        <div className="col-span-1 flex justify-end items-center gap-2">
                                                          <div className="text-end">
                                                            <p className="text-xs font-thin -mb-1 text-left">
                                                              E-social:
                                                            </p>
                                                            <p className="text-gray-600 font-bold text-lg">
                                                              {risco.codigo_esocial_risco ===
                                                                "N/A"
                                                                ? "-"
                                                                : risco.codigo_esocial_risco}
                                                            </p>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <hr />
                                                      <div className="grid grid-cols-4 gap-2 py-2 items-center">
                                                        <div className="col-span-3">
                                                          <div className="flex items-center gap-1">
                                                            <p className="text-gray-600 text-sm">
                                                              Grupo:
                                                            </p>
                                                            <p className="text-gray-600 font-bold text-sm">
                                                              {risco.grupo_risco}
                                                            </p>
                                                          </div>
                                                          <div className="flex items-center gap-1">
                                                            <p className="text-gray-600 text-sm">
                                                              Metodologia:
                                                            </p>
                                                            <p className="text-gray-600 font-bold text-sm">
                                                              {
                                                                risco.metodologia_risco
                                                              }
                                                            </p>
                                                          </div>
                                                        </div>
                                                        <div className="inline-block space-y-1 mt-2 col-span-1">
                                                          <div className="flex justify-center items-center gap-1">
                                                            <img
                                                              src={icon_alerta}
                                                              className="h-4 w-4"
                                                            />
                                                            <p className="text-sm text-gray-500 truncate">
                                                              NA:{" "}
                                                              <span className="text-sm font-medium text-gray-700">
                                                                {risco.nivel_acao_risco ===
                                                                  0
                                                                  ? "-"
                                                                  : risco.nivel_acao_risco}
                                                              </span>
                                                            </p>
                                                          </div>
                                                          <div className="flex justify-center items-center gap-1">
                                                            <img
                                                              src={icon_perigo}
                                                              className="h-4 w-4"
                                                            />
                                                            <p className="text-sm text-gray-500 truncate">
                                                              LT:{" "}
                                                              <span className="text-sm font-medium text-gray-700">
                                                                {risco.limite_tolerancia_risco ===
                                                                  0
                                                                  ? "-"
                                                                  : risco.limite_tolerancia_risco}
                                                              </span>
                                                            </p>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <hr />
                                                      <div
                                                        className={`relative cursor-pointer rounded px-2 bg-gray-100 hover:shadow py-1 mt-1 ${showMedidasRisk &&
                                                          selectedRiscoId ===
                                                          risco.id_risco
                                                          ? ""
                                                          : ""
                                                          }`}
                                                      >
                                                        {loadingMedida && (
                                                          <LoadingScreen />
                                                        )}
                                                        <div
                                                          className="flex justify-between items-center text-sky-700 mb-1"
                                                          onClick={() =>
                                                            handleClickMedidas(
                                                              risco.id_risco
                                                            )
                                                          }
                                                        >
                                                          <h3 className="text-sm">
                                                            Medidas
                                                          </h3>
                                                          <div className="flex items-center gap-2">
                                                            {showMedidasRisk &&
                                                              selectedRiscoId ===
                                                              risco.id_risco ? (
                                                              <>
                                                                <IoIosArrowUp />
                                                              </>
                                                            ) : (
                                                              <>
                                                                <IoIosArrowDown />
                                                              </>
                                                            )}
                                                          </div>
                                                        </div>
                                                        <ul className="space-y-2">
                                                          {/* Adicionar Medidas */}
                                                          {showMedidasRisk &&
                                                            selectedRiscoId ===
                                                            risco.id_risco && (
                                                              <>
                                                                <li
                                                                  className="cursor-pointer"
                                                                  onClick={() =>
                                                                    handleAdicionarMedida(
                                                                      risco
                                                                    )
                                                                  }
                                                                >
                                                                  <div className="bg-white border rounded px-2 py-1 mb-2 hover:shadow">
                                                                    <div className="flex justify-center items-center text-sky-700 font-bold gap-1">
                                                                      <IoAddCircle />
                                                                      <p>
                                                                        Adicionar
                                                                        Medidas
                                                                      </p>
                                                                    </div>
                                                                  </div>
                                                                </li>
                                                                {medidasData &&
                                                                  medidasData.length >
                                                                  0 ? (
                                                                  <>
                                                                    {medidasData.map(
                                                                      (medida) => (
                                                                        <li
                                                                          key={
                                                                            medida.id_medida
                                                                          }
                                                                        >
                                                                          <div className="bg-white border rounded py-1 px-2">
                                                                            <div className="grid grid-cols-4 items-center">
                                                                              <div className="col-span-3">
                                                                                <p className="text-sky-700 font-medium truncate">
                                                                                  {
                                                                                    medida.descricao_medida
                                                                                  }
                                                                                </p>
                                                                              </div>
                                                                              <div className="col-span-1 flex justify-end pr-2 items-center gap-3">
                                                                                <p className="text-sky-700 text-sm">
                                                                                  {typeMedida(
                                                                                    medida.grupo_medida
                                                                                  )}
                                                                                </p>
                                                                              </div>
                                                                            </div>
                                                                          </div>
                                                                        </li>
                                                                      )
                                                                    )}
                                                                  </>
                                                                ) : (
                                                                  <li>
                                                                    <p className="text-gray-600 text-sm font-medium text-center">
                                                                      Nenhuma medida
                                                                      cadastrada.
                                                                    </p>
                                                                  </li>
                                                                )}
                                                              </>
                                                            )}
                                                        </ul>
                                                      </div>
                                                    </div>
                                                  ))}
                                                </>
                                              )}
                                          </ul>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          )}

                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modais */}
      <ModalSetorProcesso
        isOpen={showModalSetorProcesso}
        onCancel={closeModalSetorProcesso}
        setorId={selectedSetor.id_setor}
        setorName={selectedSetor.nome_setor}
        setor={setoresData}
      />

      <ModalProcessoRisco
        isOpen={showModalProcessoRisco}
        onCancel={closeModalProcessoRisco}
        childId={selectedProcesso.id_processo}
        childName={selectedProcesso.nome_processo}
        children={processosData}
      />

      <ModalRiscoMedida
        isOpen={showModalRiscoMedida}
        onCancel={closeModalRiscoMedida}
        childId={selectedRisco.id_risco}
        childName={selectedRisco.nome_risco}
        children={riscosData}
      />

      <ModalSetorExame
        isOpen={showModalSetorExame}
        onCancel={closeModalSetorExame}
        setorId={selectedSetor.id_setor}
        setorName={selectedSetor.nome_setor}
        childId={exames.id_exame}
        childName={exames.nome_exame}
        children={exames}
      />
    </>
  );
}

export default ProfileCompany;
