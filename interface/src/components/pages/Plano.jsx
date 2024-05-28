import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

import FrmPlano from "./subPages/PlanoAcao/FrmPlano";
import GridPlano from "./subPages/PlanoAcao/GridPlano";

function Plano() {

  const {
    loadSelectedCompanyFromLocalStorage,
    fetchUnidades,
    fetchSetores,
    getCargos, cargos,
    getProcessos,
    getRiscos,
    fetchMedidas,
    getSetoresProcessos,
    getProcessosRiscos,
    getRiscosMedidas,
    getInventario, inventario,
    getGlobalSprm,
    getPlano,
    fetchContatos
  } = useAuth(null);

  const [onEdit, setOnEdit] = useState(null);
  const [setores, setSetores] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [processos, setProcessos] = useState([]);
  const [contactInfo, setContactInfo] = useState([]);
  const [contatos, setContatos] = useState([]);
  const [medidas, setMedidas] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [plano, setPlano] = useState([]);
  const [setoresProcessos, setSetoresProcessos] = useState([]);
  const [processosRiscos, setProcessosRiscos] = useState([]);
  const [riscosMedidas, setRiscosMedidas] = useState([]);
  const [riscos, setRiscos] = useState([]);
  const [globalSprm, setGlobalSprm] = useState([]);


  useEffect(() => {
    loadSelectedCompanyFromLocalStorage();
  }, []);

  const fetchPlano = async () => {
    const response = await getPlano();
    setPlano(response);
  }

  const fetchGlobalSprm = async () => {
    const response = await getGlobalSprm();
    setGlobalSprm(response);
  }

  const get = async () => {
    fetchPlano();
    const sectors = await fetchSetores();
    setSetores(sectors);
    const units = await fetchUnidades();
    setUnidades(units);
    const proc = await getProcessos();
    setProcessos(proc);
    const data = await fetchContatos(companyId);
    setContatos(data);
    const response = await fetchMedidas('all');
    setMedidas(response);
    const userData = JSON.parse(localStorage.getItem("selectedCompanyData"));
    setCompanyId(userData.id_empresa);
    const setProc = await getSetoresProcessos();
    setSetoresProcessos(setProc);
    const procRisc = await getProcessosRiscos();
    setProcessosRiscos(procRisc);
    const riscMed = await getRiscosMedidas();
    setRiscosMedidas(riscMed);
    const risc = await getRiscos();
    setRiscos(risc);
    fetchGlobalSprm();
  }

  useEffect(() => {
    get();
  }, [companyId]);

  return (
    <>
      <div className="flex justify-center items-center mt-12 mb-10">
        <h1 className="text-3xl font-extrabold text-sky-700">Plano de Ação</h1>
      </div>

      <FrmPlano
        unidades={unidades}
        cargos={cargos}
        setores={setores}
        setSetores={setSetores}
        processos={processos}
        riscos={riscos}
        setoresProcessos={setoresProcessos}
        processosRiscos={processosRiscos}
        onEdit={onEdit}
        companyId={companyId}
        setOnEdit={setOnEdit}
        riscosMedidas={riscosMedidas}
        medidas={medidas}
        getGlobalSprm={fetchGlobalSprm}
        setGlobalSprm={setGlobalSprm}
        globalSprm={globalSprm}
        getPlano={fetchPlano}
        contatos={contatos}
        planos={plano}
      />

      <div className="mb-10">
        <GridPlano
          setOnEdit={setOnEdit}
          unidade={unidades}
          setor={setores}
          processo={processos}
          risco={riscos}
          companyId={companyId}
          plano={plano}
          medidas={medidas}
        />
      </div>
    </>
  )
}

export default Plano;