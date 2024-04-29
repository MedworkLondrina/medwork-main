import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import icon_alerta from '../../media/icons_sup/icon_alerta.png';
import icon_perigo from '../../media/icons_sup/icon_perigo.png';
import LoadingScreen from "../../pages/subPages/components/LoadingScreen";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { IoAddCircle } from "react-icons/io5";

import ModalSetorProcesso from '../../pages/subPages/components/Modal/ModalSetorProcesso';
import ModalProcessoRisco from '../../pages/subPages/components/Modal/ModalRiscoMedidas';
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

  const [setorId, setSetorId] = useState('');
  const [setorNome, setSetorNome] = useState('');
  const [showModalSetorProcesso, setShowModalSetorProcesso] = useState(false);
  const [processoId, setProcessoId] = useState('');
  const [processoNome, setProcessoNome] = useState('');
  const [showModalProcessoRisco, setShowModalProcessoRisco] = useState(false);
  const [riscoId, setRiscoId] = useState('');
  const [riscoNome, setRiscoNome] = useState('');
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

        // const procRisc = await getProcessosRiscos();
        // const risc = await getRiscos();
        // const mapProcFilter = filteredProcessos.map((i) => i.id_processo);
        // const filterProcRisco = procRisc.filter((i) => mapProcFilter.includes(i.fk_processo_id));
        // const riscMap = filterProcRisco.map((i) => i.fk_risco_id);
        // const filteredRiscos = risc.filter((i) => riscMap.includes(i.id_risco));
        // const orderRiscos = filteredRiscos.sort((a, b) => b.id_risco - a.id_risco);
        // setRiscosData(orderRiscos);

        // const riscMed = await getRiscosMedidas();
        // const med = await fetchMedidas('all');
        // const mapRiscFilter = filteredRiscos.map((i) => i.id_risco);
        // const filterRiscMed = riscMed.filter((i) => mapRiscFilter.includes(i.fk_risco_id));
        // const medMap = filterRiscMed.map((i) => i.fk_medida_id);
        // const filteredMedidas = med.filter((i) => medMap.includes(i.id_medida));
        // const orderMedidas = filteredMedidas.sort((a, b) => b.id_medida - a.id_medida);
        // setMedidasData(orderMedidas);
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
    console.log(selectedSetor);
    setSetorId(selectedSetor.id_setor);
    setSetorNome(selectedSetor.nome_setor);
    openModalSetorProcesso();
  }

  // Controle Modais
  const openModalSetorProcesso = () => setShowModalSetorProcesso(true);
  const openModalProcessoRisco = () => setShowModalProcessoRisco(true);
  const openModalRiscoMedida = () => setShowModalRiscoMedida(true);

  const closeModalSetorProcesso = () => {
    carregarInformações(selectedSetor.id_setor);
    setShowModalSetorProcesso(false);
  };
  const closeModalProcessoRisco = () => setShowModalProcessoRisco(false);
  const closeModalRiscoMedida = () => setShowModalRiscoMedida(false);

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
              <p className='text-white font-light text-sm truncate'>Razão Social: <span className="text-lg font-medium truncate">{company.razao_social}</span></p>
              <p className='text-white'>Contato:</p>
              <div className='bg-white w-2/4 rounded-sm px-2 py-1 text-center grid grid-cols-2 justify-center items-center gap-2'>
                <p className='text-sky-600 font-semibold truncate text-right'>{contact ? contact.nome_contato : ''}</p>
                <p className='text-sm text-gray-700 font-light truncate text-left'>- {contact ? contact.email_contato : ''}</p>
              </div>
            </div>
            <div className='col-span-1 text-right px-2'>
              <h2 className='text-white font-extrabold text-2xl truncate'>{company.cnpj_empresa}</h2>
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
                    <div className={`inline-block py-3 px-4 border-b-2 border-transparent rounded-t-lg cursor-pointer ${showUnidadeData.id_unidade === item.id_unidade ? 'text-sky-600 bg-gray-100' : 'hover:bg-gray-100 hover:text-sky-600 hover:border-b-2 hover:border-sky-600'}`}>
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
                      <li key={item.id_setor} onClick={() => handleSelectSetor(item.id_setor)}>
                        <div className={`bg-white px-4 py-2 cursor-pointer ${showSetorData ? 'rounded-l-md' : 'rounded-md shadow hover:shadow-md'}`}>
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
                      <div className='bg-white rounded-r-md px-4 py-2 cursor-pointer'>
                        {loading && <LoadingScreen />}
                        <div className="grid grid-cols-3 gap-4">
                          {/* Cargos */}
                          {cargosData && (
                            <div className="col-span-1">
                              <h1 className="mb-2">Cargos</h1>
                              <ul className="space-y-2">
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

                          {/* Processos */}
                          <div className="col-span-2">
                            <h2 className="mb-2">Processos</h2>
                            <ul className="space-y-2">
                              <li onClick={handleAdicionarProcesso}>
                                <div className={`bg-gray-50 rounded px-4 py-2 hover:bg-gray-100 hover:shadow`}>
                                  <div className="flex justify-center items-center text-sky-700 font-bold text-center gap-1">
                                    <IoAddCircle />
                                    <p className="">Adicionar Processos</p>
                                  </div>
                                </div>
                              </li>
                              {processosData.map((item) => (
                                <li key={item.id_processo}>
                                  <div className={`bg-gray-50 rounded px-4 py-2`}>
                                    <h2 className="text-sky-700 font-medium truncate hover:whitespace-normal">{item.nome_processo}</h2>
                                    <div className="border-b border-sky-600"></div>
                                    <div className="flex items-center justify-between mt-1 mb-1" onClick={() => handleClickProcesso(item.id_processo)}>
                                      <p>Riscos</p>
                                      <div className="flex gap-2 items-center">
                                        {showRiscosProc ? (
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
                                      <li>
                                        <div className="bg-sky-600 rounded px-3 py-1 hover:bg-sky-700 hover:shadow">
                                          <div className="flex justify-center items-center text-white font-bold gap-1">
                                            <IoAddCircle />
                                            <p>Adicionar Riscos</p>
                                          </div>
                                        </div>
                                      </li>
                                      {showRiscosProc && (
                                        <>
                                          {riscosData.map((risco) => (
                                            <div key={risco.id_risco} className="bg-sky-600 rounded px-3 py-2 mb-4">
                                              <div className="grid grid-cols-3">
                                                <div className="col-span-2">
                                                  <p className="text-white font-bold text-lg">{risco.nome_risco}</p>
                                                </div>
                                                <div className="col-span-1 flex justify-end">
                                                  <p className="text-white font-bold text-lg">{risco.codigo_esocial_risco}</p>
                                                </div>
                                              </div>
                                              <div>
                                                <div className="flex items-center gap-1">
                                                  <p className="text-white text-sm">Grupo:</p>
                                                  <p className="text-white font-bold text-sm">{risco.grupo_risco}</p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <p className="text-white text-sm">Metodologia:</p>
                                                  <p className="text-white font-bold text-sm">{risco.metodologia_risco}</p>
                                                </div>
                                                <div className='flex flex-wrap gap-2 mt-2'>
                                                  <div className='bg-orange-100 px-3 py-1 rounded shadow-sm flex items-center gap-1'>
                                                    <img src={icon_alerta} className='h-4 w-4' />
                                                    <p className='text-sm text-gray-500 truncate'>
                                                      NA: <span className='text-sm font-medium text-gray-700'>{risco.nivel_acao_risco}</span>
                                                    </p>
                                                  </div>
                                                  <div className='bg-rose-100 px-3 py-1 rounded shadow-sm flex items-center gap-1'>
                                                    <img src={icon_perigo} className='h-4 w-4' />
                                                    <p className='text-sm text-gray-500 truncate'>
                                                      LT: <span className='text-sm font-medium text-gray-700'>{risco.limite_tolerancia_risco}</span>
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="border-b border-white mt-1"></div>
                                              <div className="flex justify-between items-center text-white mt-1 mb-1" onClick={() => handleClickMedidas(risco.id_risco)}>
                                                <h3 className="text-sm">Medidas</h3>
                                                <div className="flex items-center gap-2">
                                                  {showMedidasRisk ? (
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
                                                <li>
                                                  <div className="bg-gray-50 rounded px-2 py-1 mb-2 hover:bg-gray-100 hover:shadow-md">
                                                    <div className="flex justify-center items-center text-sky-700 font-bold gap-1">
                                                      <IoAddCircle />
                                                      <p>Adicionar Medidas</p>
                                                    </div>
                                                  </div>
                                                </li>
                                                {showMedidasRisk && (
                                                  <>
                                                    {medidasData && medidasData.length > 0 ? (
                                                      <>
                                                        {medidasData.map((medida) => (
                                                          <li key={medida.id_medida}>
                                                            <div className="bg-gray-50 rounded p-1">
                                                              <div className="grid grid-cols-4 items-center">
                                                                <div className="col-span-3">
                                                                  <p className="text-sky-700 font-medium">{medida.descricao_medida}</p>
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
                                                                    <p className="text-gray-700 text-sm font-medium">{medida.certificado_medida}</p>
                                                                  </div>
                                                                  <div className="flex items-center gap-1">
                                                                    <p className="text-gray-600 text-sm">Vencimento:</p>
                                                                    <p className="text-gray-700 text-sm font-medium">{medida.vencimento_certificado_medida}</p>
                                                                  </div>
                                                                </>
                                                              )}
                                                            </div>
                                                          </li>
                                                        ))}
                                                      </>
                                                    ) : (
                                                      <li className="bg-gray-50 p-1 rounded">
                                                        <p className="text-gray-600 text-sm font-medium text-center">Nenhuma medida cadastrada.</p>
                                                      </li>
                                                    )}
                                                  </>
                                                )}
                                              </ul>
                                            </div>
                                          ))}
                                        </>
                                      )}
                                    </ul>
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
        setorId={setorId}
        setorName={setorNome}
        setor={setoresData}
      />
    </>
  );
}

export default ProfileCompany;