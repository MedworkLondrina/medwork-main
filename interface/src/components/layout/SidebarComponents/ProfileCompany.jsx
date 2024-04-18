import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";

function ProfileCompany({ companyId, empresas, contatos }) {

  const {
    fetchUnidades,
    fetchSetores,
    fetchCargos,
    getSetoresProcessos,
    getProcessos,
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

  const filter = () => {
    const findCompany = empresas.find((item) => item.id_empresa === companyId);
    const findContato = contatos.find((item) => item.id_contato === findCompany.fk_contato_id);
    setCompany(findCompany);
    setContact(findContato);
  }

  const getUnidades = async () => {
    const units = await fetchUnidades();
    setUnidades(units);
  };

  useEffect(() => {
    filter();
    getUnidades();
  }, [companyId]);

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

  const handleSelectSetor = async (item) => {
    try {
      const sector = setoresData.find((i) => i.id_setor === item);
      if (sector) {
        const offices = await fetchCargos();
        const filteredCargos = offices.filter((i) => i.fk_setor_id === item);
        setCargosData(filteredCargos);

        const setProc = await getSetoresProcessos();
        const proc = await getProcessos();
        const procMap = setProc.map((i) => i.fk_processo_id);
        const filteredProcessos = proc.filter((i) => procMap.includes(i.id_processo));
        setProcessosData(filteredProcessos);

        setSelectedSetor(sector);
        setShowSetorData(!showSetorData);
      } else {
        setSelectedSetor(null);
        setShowSetorData(false);
      }
    } catch (error) {
      console.error(`Erro ao buscar setores. Status ${error}`);
    }
  };

  if (!companyId) {
    return;
  };

  return (
    <>
      <div>
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
                              {processosData.map((item) => (
                                <li key={item.id_processo}>
                                  <div className={`bg-gray-50 rounded px-4 py-2`}>
                                    <h2 className="text-sky-700 font-medium truncate hover:whitespace-normal">{item.nome_processo}</h2>
                                    <div className="border-b border-sky-600"></div>
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
    </>
  );
}

export default ProfileCompany;