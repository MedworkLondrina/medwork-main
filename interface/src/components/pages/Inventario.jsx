import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

import FrmInventario from "./subPages/InventarioRisco/FrmInventario";
import GridInventario from "./subPages/InventarioRisco/GridInventario";

function Inventario() {

  const {
    loadSelectedCompanyFromLocalStorage,
    fetchUnidades,
    fetchSetores,
    fetchCargos,
    getProcessos,
    getRiscos,
    fetchMedidas,
    getMedidasAdm, medidasAdm, getMedidasEpi, medidasEpi, getMedidasEpc, medidasEpc,
    getSetoresProcessos,
    getProcessosRiscos,
    getRiscosMedidas,
    getInventario,
    getGlobalSprm, getGlobalSprmByRiscoId,
    getAparelhos,
    getConclusoes,
  } = useAuth(null);

  const [companyId, setCompanyId] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [setores, setSetores] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [processos, setProcessos] = useState([]);
  const [riscos, setRiscos] = useState([]);
  const [medidas, setMedidas] = useState([]);
  const [setoresProcessos, setSetoresProcessos] = useState([]);
  const [processosRiscos, setProcessosRiscos] = useState([]);
  const [riscosMedidas, setRiscosMedidas] = useState([]);
  const [aparelhos, setAparelhos] = useState([]);
  const [globalSprm, setGlobalSprm] = useState([]);
  const [inventario, setInventario] = useState([]);

  const [onEdit, setOnEdit] = useState(null);

  const getCompany = async () => {
    const selectCompany = await loadSelectedCompanyFromLocalStorage();
    setCompanyId(selectCompany.id_empresa);
  };

  useEffect(() => {
    getCompany();
    getUnidades();
  }, []);

  const getUnidades = async () => {
    const response = await fetchUnidades();
    setUnidades(response);
  };

  const getSetores = async () => {
    const response = await fetchSetores();
    setSetores(response);
  };

  const getCargos = async () => {
    const response = await fetchCargos();
    setCargos(response);
  };

  const fetchProcessos = async () => {
    const response = await getProcessos();
    setProcessos(response);
  };

  const fetchRiscos = async () => {
    const response = await getRiscos();
    setRiscos(response);
  };

  const getMedidas = async () => {
    const response = await fetchMedidas('all');
    setMedidas(response);
  };

  const fetchSetoresProcessos = async () => {
    const response = await getSetoresProcessos();
    setSetoresProcessos(response);
  };

  const fetchProcessosRiscos = async () => {
    const response = await getProcessosRiscos();
    setProcessosRiscos(response);
  };

  const fetchRiscosMedidas = async () => {
    const response = await getRiscosMedidas();
    setRiscosMedidas(response);
  };

  const fetchAparelhos = async () => {
    const response = await getAparelhos();
    setAparelhos(response);
  };

  const fetchGlobalSprm = async () => {
    const response = await getGlobalSprm();
    setGlobalSprm(response);
  };

  const fetchInventario = async () => {
    const response = await getInventario();
    setInventario(response);
  };

  const handleEdit = (item) => {
    setOnEdit(item);
  }


  useEffect(() => {
    getUnidades();
    fetchInventario();
    getSetores();
    fetchProcessos();
    fetchRiscos();
    fetchAparelhos();
  }, [companyId]);


  return (
    <>
      <FrmInventario
        unidades={unidades}
        cargos={cargos}
        getCargos={getCargos}
        setores={setores}
        getSetores={getSetores}
        processos={processos}
        getProcessos={fetchProcessos}
        getRiscos={fetchRiscos}
        getMedidas={getMedidas}
        medidas={medidas}
        riscos={riscos}
        setoresProcessos={setoresProcessos}
        getSetoresProcessos={fetchSetoresProcessos}
        getProcessosRiscos={fetchProcessosRiscos}
        processosRiscos={processosRiscos}
        onEdit={onEdit}
        companyId={companyId}
        handleEdit = {handleEdit}
        setOnEdit={setOnEdit}
        riscosMedidas={riscosMedidas}
        getRiscosMedidas={fetchRiscosMedidas}
        medidasAdm={medidasAdm}
        medidasEpi={medidasEpi}
        medidasEpc={medidasEpc}
        getGlobalSprm={fetchGlobalSprm}
        setGlobalSprm={setGlobalSprm}
        globalSprm={globalSprm}
        getGlobalSprmByRiscoId={getGlobalSprmByRiscoId}
        getInventario={fetchInventario}
        aparelhos={aparelhos}
        inventario={inventario}
        getConclusoes={getConclusoes}
      />

      <GridInventario
        setOnEdit={setOnEdit}
        inventario={inventario}
        unidade={unidades}
        setor={setores}
        processo={processos}
        risco={riscos}
        companyId={companyId}
        aparelhos={aparelhos}
      />
    </>
  )
}

export default Inventario;