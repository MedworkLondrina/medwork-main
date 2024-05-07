import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import icon_alerta from '../../media/icons_sup/icon_alerta.png';
import icon_perigo from '../../media/icons_sup/icon_perigo.png';
import LoadingScreen from "../../pages/subPages/components/LoadingScreen";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { IoAddCircle } from "react-icons/io5";

import ModalSetorProcesso from '../../pages/subPages/components/Modal/ModalSetorProcesso';
import ModalProcessoRisco from '../../pages/subPages/components/Modal/ModalProcessoRisco';
import ModalRiscoMedida from '../../pages/subPages/components/Modal/ModalRiscoMedidas';

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
    fetchCnae, fetchProcessoCnae,
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
  const [setorSelecionado, setSetorSelecionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRiscosProc, setShowRiscosProc] = useState(false);
  const [showMedidasRisk, setShowMedidasRisk] = useState(false);
  const [selectedProcessoId, setSelectedProcessoId] = useState(null);
  const [selectedRiscoId, setSelectedRiscoId] = useState(null);
  const [cnaes, setCnaes] = useState([]);

  const [showModalSetorProcesso, setShowModalSetorProcesso] = useState(false);
  const [showModalProcessoRisco, setShowModalProcessoRisco] = useState(false);
  const [showModalRiscoMedida, setShowModalRiscoMedida] = useState(false);

  const filter = () => {
    const findCompany = empresas.find((item) => item.id_empresa === companyId);
    const findContato = contatos.find((item) => item.id_contato === findCompany.fk_contato_id);
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
        const filterContato = contatos.find((i) => i.id_contato === und.fk_contato_id);
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
      await carregarInformações(idSetor);
      setLoading(false);
    } else {
      setSetorSelecionado('');
      setShowSetorData(false);
    }
  };

  const carregarInformações = async (item) => {
    try {
      const sector = setoresData.find((i) => i.id_setor === item);
      setSelectedSetor(sector);
      if (sector) {
        const offices = await fetchCargos();
        const filteredCargos = offices.filter((i) => i.fk_setor_id === item);
        const orderCargos = filteredCargos.sort((a, b) => b.id_cargo - a.id_cargo);
        setCargosData(orderCargos);

        const setProc = await getSetoresProcessos();
        const proc = await getProcessos();
        const filterSetProc = setProc.filter((i) => i.fk_setor_id === sector.id_setor);
        const procMap = filterSetProc.map((i) => i.fk_processo_id);
        const filteredProcessos = proc.filter((i) => procMap.includes(i.id_processo));
        const orderProcessos = filteredProcessos.sort((a, b) => b.id_processo - a.id_processo);
        setProcessosData(orderProcessos);

        findCnaes(procMap);

      } else {
        setSelectedSetor(null);
        setShowSetorData(false);
      }
    } catch (error) {
      console.error(`Erro ao buscar setores. Status ${error}`);
    }
  };

  const carregarRiscos = async (idProcesso) => {
    try {
      const procRisc = await getProcessosRiscos();
      const risc = await getRiscos();

      // Filtrar os riscos apenas para o processo específico
      const filterProcRisco = procRisc.filter((i) => i.fk_processo_id === idProcesso);
      const riscIds = filterProcRisco.map((i) => i.fk_risco_id);
      const filteredRiscos = risc.filter((i) => riscIds.includes(i.id_risco));

      const orderRiscos = filteredRiscos.sort((a, b) => b.id_risco - a.id_risco);
      setRiscosData(orderRiscos);
    } catch (error) {
      console.error(`Erro ao carregar riscos. Status: ${error}`);
    }
  };

  const carregarMedidas = async (idRisco) => {
    try {
      const riscMed = await getRiscosMedidas();
      const med = await fetchMedidas('all');

      // Filtrar as medidas apenas para o risco específico
      const filterRiscMed = riscMed.filter((i) => i.fk_risco_id === idRisco);
      const medIds = filterRiscMed.map((i) => i.fk_medida_id);
      const filteredMedidas = med.filter((i) => medIds.includes(i.id_medida));

      const orderMedidas = filteredMedidas.sort((a, b) => b.id_medida - a.id_medida);
      setMedidasData(orderMedidas);
    } catch (error) {
      console.error(`Erro ao carregar medidas. Status: ${error}`);
    }
  };

  const handleClickProcesso = async (idProcesso) => {
    if (selectedProcessoId !== idProcesso) {
      await carregarRiscos(idProcesso);
      setShowRiscosProc(true);
      setSelectedProcessoId(idProcesso);
    } else {
      setShowRiscosProc(false);
      setSelectedProcessoId('');
    }
  };

  const handleClickMedidas = async (idRisco) => {
    if (selectedRiscoId !== idRisco) {
      await carregarMedidas(idRisco);
      setShowMedidasRisk(true);
      setSelectedRiscoId(idRisco);
    } else {
      setShowMedidasRisk(false);
      setSelectedRiscoId('');
    }
  };

  const typeMedida = (item) => {
    switch (item) {
      case 'MI':
        return "Individual";
      case 'MA':
        return 'Administrativa';
      case 'MC':
        return 'Coletiva';
      case 'TR':
        return 'Treinamento';
      case 'INS':
        return 'Inspeção';
      case 'MG':
        return 'Geral';

      default:
        return 'N/A'
    }
  };

  const handleAdicionarProcesso = () => {
    openModalSetorProcesso();
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

      const filteredProcCnaes = procCnae.filter((i) => processosIds.includes(i.fk_processo_id));

      const cnaesComProcesso = filteredProcCnaes.map(item => {
        const cnae = cnaes.find(cnae => cnae.id_cnae === item.fk_cnae_id);
        return {
          ...cnae,
          id_processo: item.fk_processo_id
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
  const openModalRiscoMedida = () => setShowModalRiscoMedida(true);

  const closeModalSetorProcesso = async () => {
    await carregarInformações(selectedSetor.id_setor);
    setShowModalSetorProcesso(false);
  };
  const closeModalProcessoRisco = async () => {
    await carregarRiscos(selectedProcesso.id_processo);
    setSelectedProcessoId(selectedProcesso.id_processo);
    setShowRiscosProc(true);
    setShowModalProcessoRisco(false);
  };
  const closeModalRiscoMedida = async () => {
    await carregarMedidas(selectedRisco.id_risco);
    setSelectedRiscoId(selectedRisco.id_risco);
    setShowMedidasRisk(true);
    setShowModalRiscoMedida(false);
  };

  if (!companyId) {
    return;
  };


  return (
    <>
      <div className="h-fit">
        {/* Company Card */}
        <div className='w-full bg-sky-600 shadow-md px-4 py-4 rounded-xl'>
          <div className='px-4 grid grid-cols-3'>
            <div className='col-span-2'>
              <h2 className='text-white font-extrabold text-2xl truncate'>{company.nome_empresa}</h2>
              <p className='text-white font-light text-sm truncate -mt-1 mb-1'>Razão Social: <span className="text-lg font-medium truncate">{company.razao_social}</span></p>
              <p className='text-white'>Contato:</p>
            </div>
            <div className='col-span-1 text-right px-2'>
              <h2 className='text-white font-extrabold text-2xl truncate'>{company.cnpj_empresa}</h2>
            </div>
          </div>
          <div className="px-4">
            <div className='bg-white rounded-sm px-3 inline-block'>
              <p className='text-sky-600 font-semibold'>{contact ? contact.nome_contato : ''} - <span className='text-sm text-gray-700 font-light'>{contact ? contact.email_contato : ''}</span></p>
            </div>
          </div>
        </div>

        {/* Tab Unidades */}
        {unidades && (
          <div className="pt-2 px-2">
            <div className=" border-b border-gray-300">
              <ul className="flex -mb-px">
                {unidades.map((item) => (
                  <li key={item.id_unidade} onClick={() => handleSelectUnidade(item.id_unidade)}>
                    <div className={`inline-block py-3 px-4 border-b-2 border-transparent rounded-t-lg ${showUnidadeData.id_unidade === item.id_unidade ? 'text-sky-600 bg-gray-100' : 'hover:bg-gray-100 hover:text-sky-600 hover:border-b-2 hover:border-sky-600 cursor-pointer'}`}>
                      <p className="text-sm font-medium text-center text-gray-500 cursor-pointer">{item.nome_unidade}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Setores */}
        {showSetores && (
          <div className='w-full py-4 px-6 bg-gray-100'>
            {/* Card Unidades */}
            {showUnidade && (
              <>
                <div className='w-full bg-white shadow px-4 py-2 rounded-md mb-4'>
                  <div className='grid grid-cols-3'>
                    <div className='col-span-2'>
                      <h2 className='text-sky-700 font-bold text-xl truncate'>{showUnidadeData.nome_unidade}</h2>
                      <p className='truncate text-gray-800 font-medium'>{showUnidadeData.endereco_unidade}, {showUnidadeData.numero_unidade} {showUnidadeData.complemento_unidade} - {showUnidadeData.cidade_unidade}/{showUnidadeData.uf_unidade}</p>
                      <div className="flex items-center gap-1">
                        <p className='text-gray-600 text-sm font-light'>Contato:</p>
                        <p className='text-sky-700 font-semibold truncate'>{contatoUnidade ? contatoUnidade.nome_contato : ''}</p>
                      </div>
                    </div>
                    <div className='col-span-1 text-right px-2'>
                      <h2 className='text-sky-700 font-bold text-2xl truncate'>{company.cnpj_empresa}</h2>
                    </div>
                  </div>
                </div>
              </>
            )}
            

            {setoresData && (
              <div className='w-full grid grid-cols-3'>
                {/* Lista de Setores */}
                <div className='col-span-1'>
                  <h1 className="mb-1 ml-1 font-medium text-gray-600">Lista de Setores</h1>
                  <ul className='space-y-4'>
                    {setoresData.map((item) => (
                      <li className="cursor-pointer" key={item.id_setor} onClick={() => handleSelectSetor(item.id_setor)}>
                        <div className={`bg-white px-4 py-2 ${showSetorData ? 'rounded-l-md' : 'rounded-md shadow hover:shadow-md'}`}>
                          <h2 className='text-sky-700 font-bold text-lg truncate'>{item.nome_setor}</h2>
                          <div className='border-b border-gray-200 mb-2'></div>
                          <p className='truncate text-gray-700 text-sm'>{item.ambiente_setor}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Setor Selecionado */}
                <div className="col-span-2">
                  {showSetorData && (
                    <>
                      <h1 className="mb-1 ml-1 font-medium text-gray-600">Setor {selectedSetor.nome_setor}</h1>
                      <div className='bg-white rounded-r-md px-4 py-2'>
                        {loading && <LoadingScreen />}
                        <div className="">
                          {/* Cargos */}
                          {cargosData && (
                            <div className="">
                              <h1 className="mb-2">Cargos</h1>
                              <ul className="gap-2 flex flex-wrap items-center">
                                {cargosData.map((item) => (
                                  <li key={item.id_cargo}>
                                    <div className={`bg-gray-50 rounded px-4 py-2`}>
                                      <h2 className="text-sky-700 font-medium truncate hover:whitespace-normal">{item.nome_cargo}</h2>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="my-2">
                            <hr />
                          </div>

                          {/* Processos */}
                          <div className="">
                            <h2 className="mb-2">Processos</h2>
                            <ul className="space-y-2 mb-2">
                              {/* Adicionar Processos */}
                              <li className="cursor-pointer" onClick={handleAdicionarProcesso}>
                                <div className={`bg-gray-50 rounded px-4 py-2 hover:bg-gray-100 hover:shadow`}>
                                  <div className="flex justify-center items-center text-sky-700 font-bold text-center gap-1">
                                    <IoAddCircle />
                                    <p className="">Adicionar Processos</p>
                                  </div>
                                </div>
                              </li>
                              {/* Lista de Processos */}
                              {processosData.map((item) => (
                                <li key={item.id_processo}>
                                  <div className={`bg-gray-50 rounded px-4 py-2`}>
                                    <div>
                                      <p className="text-sm text-gray-700 font-light -mb-1">Processo:</p>
                                      <h2 className="text-sky-700 font-medium truncate hover:whitespace-normal">{item.nome_processo}</h2>
                                      <div>
                                        <p className="text-sm text-gray-700 font-light">Cnae's:</p>
                                        <div className="flex gap-2 mb-2">
                                          {cnaes.filter((cnae) => cnae.id_processo === item.id_processo).map((cnae, i) => (
                                            <div className="bg-white px-2 py-1 rounded">
                                              <p key={i.id_cnae} className="text-sky-700 font-medium truncate hover:whitespace-normal">{cnae.subclasse_cnae}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="border-b border-sky-600"></div>
                                    <div className={`cursor-pointer rounded px-2 bg-white hover:shadow py-1 mt-1 ${showRiscosProc && selectedProcessoId === item.id_processo ? 'shadow' : ''}`}>
                                      <div className="flex items-center justify-between mt-1 mb-1" onClick={() => handleClickProcesso(item.id_processo)}>
                                        <p className="text-sm">Riscos</p>
                                        {/* Mostrar Riscos */}
                                        <div className="flex gap-2 items-center">
                                          {showRiscosProc && selectedProcessoId === item.id_processo ? (
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
                                        {showRiscosProc && selectedProcessoId === item.id_processo && (
                                          <>
                                            <li className="cursor-pointer" onClick={() => handleAdicionarRisco(item)}>
                                              <div className="bg-white border rounded px-3 py-1 hover:shadow">
                                                <div className="flex justify-center items-center text-sky-700 font-bold gap-1">
                                                  <IoAddCircle />
                                                  <p>Adicionar Riscos</p>
                                                </div>
                                              </div>
                                            </li>
                                            {riscosData.map((risco) => (
                                              <div key={risco.id_risco} className="bg-white border rounded px-3 py-2 mb-4">
                                                <div className="grid grid-cols-3">
                                                  <div className="col-span-2">
                                                    <div>
                                                      <p className="text-gray-600 font-thin text-xs -mb-1">Risco:</p>
                                                      <p className="text-gray-600 font-bold text-lg">{risco.nome_risco}</p>
                                                    </div>
                                                  </div>
                                                  <div className="col-span-1 flex justify-end">
                                                    <div className="text-end">
                                                      <p className="text-xs font-thin -mb-1 text-left">E-social:</p>
                                                      <p className="text-gray-600 font-bold text-lg">{risco.codigo_esocial_risco === "N/A" ? "-" : risco.codigo_esocial_risco}</p>
                                                    </div>
                                                  </div>
                                                </div>
                                                <hr />
                                                <div className="grid grid-cols-4 gap-2 py-2 items-center">
                                                  <div className="col-span-3">
                                                    <div className="flex items-center gap-1">
                                                      <p className="text-gray-600 text-sm">Grupo:</p>
                                                      <p className="text-gray-600 font-bold text-sm">{risco.grupo_risco}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                      <p className="text-gray-600 text-sm">Metodologia:</p>
                                                      <p className="text-gray-600 font-bold text-sm">{risco.metodologia_risco}</p>
                                                    </div>
                                                  </div>
                                                  <div className='inline-block space-y-1 mt-2 col-span-1'>
                                                    <div className='flex justify-center items-center gap-1'>
                                                      <img src={icon_alerta} className='h-4 w-4' />
                                                      <p className='text-sm text-gray-500 truncate'>
                                                        NA: <span className='text-sm font-medium text-gray-700'>{risco.nivel_acao_risco === 0 ? "-" : risco.nivel_acao_risco}</span>
                                                      </p>
                                                    </div>
                                                    <div className='flex justify-center items-center gap-1'>
                                                      <img src={icon_perigo} className='h-4 w-4' />
                                                      <p className='text-sm text-gray-500 truncate'>
                                                        LT: <span className='text-sm font-medium text-gray-700'>{risco.limite_tolerancia_risco === 0 ? "-" : risco.limite_tolerancia_risco}</span>
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                                <hr />
                                                <div className={`${showMedidasRisk && selectedRiscoId === risco.id_risco ? 'bg-gray-100 px-2 py-1 rounded mt-1' : ''}`}>
                                                  <div className="flex justify-between items-center text-sky-700 mt-1 mb-1 rounded hover:bg-gray-100 hover:px-1" onClick={() => handleClickMedidas(risco.id_risco)}>
                                                    <h3 className="text-sm">Medidas</h3>
                                                    <div className="flex items-center gap-2">
                                                      {showMedidasRisk && selectedRiscoId === risco.id_risco ? (
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
                                                    {showMedidasRisk && selectedRiscoId === risco.id_risco && (
                                                      <>
                                                        <li className="cursor-pointer" onClick={() => handleAdicionarMedida(risco)}>
                                                          <div className="bg-white border rounded px-2 py-1 mb-2 hover:shadow-md">
                                                            <div className="flex justify-center items-center text-sky-700 font-bold gap-1">
                                                              <IoAddCircle />
                                                              <p>Adicionar Medidas</p>
                                                            </div>
                                                          </div>
                                                        </li>
                                                        {medidasData && medidasData.length > 0 ? (
                                                          <>
                                                            {medidasData.map((medida) => (
                                                              <li key={medida.id_medida}>
                                                                <div className="bg-white border rounded py-1 px-2">
                                                                  <div className="grid grid-cols-4 items-center">
                                                                    <div className="col-span-3">
                                                                      <p className="text-sky-700 font-medium truncate">{medida.descricao_medida}</p>
                                                                    </div>
                                                                    <div className="col-span-1 flex justify-end pr-2">
                                                                      <p className="text-sky-700 text-sm">{typeMedida(medida.grupo_medida)}</p>
                                                                    </div>
                                                                  </div>
                                                                  {medida.grupo_medida === 'MI' && (
                                                                    <>
                                                                      <div className="border-b border-sky-600"></div>
                                                                      <div className="flex items-center gap-1">
                                                                        <p className="text-gray-600 text-sm">C.A:</p>
                                                                        <p className="text-gray-700 text-sm font-medium">{!medida.certificado_medida ? "-" : medida.certificado_medida}</p>
                                                                      </div>
                                                                      <div className="flex items-center gap-1">
                                                                        <p className="text-gray-600 text-sm">Vencimento:</p>
                                                                        <p className="text-gray-700 text-sm font-medium">{!medida.vencimento_certificado_medida ? "-" : medida.vencimento_certificado_medida}</p>
                                                                      </div>
                                                                    </>
                                                                  )}
                                                                </div>
                                                              </li>
                                                            ))}
                                                          </>
                                                        ) : (
                                                          <li>
                                                            <p className="text-gray-600 text-sm font-medium text-center">Nenhuma medida cadastrada.</p>
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
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

          </div>
        )}
      </div >

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
    </>
  );
}

export default ProfileCompany;