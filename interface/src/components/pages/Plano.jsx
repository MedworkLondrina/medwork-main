import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

import FrmPlano from "./subPages/PlanoAcao/FrmPlano";
import GridPlano from "./subPages/PlanoAcao/GridPlano";

function Plano() {

  const {
    handleSetCompanyId, companyId, selectedCompany,
    fetchUnidades, 
    fetchSetores, 
    getCargos, cargos,
    getProcessos,
    getRiscos, riscos,
    fetchMedidas,
    getSetoresProcessos, setSetoresProcessos, setoresProcessos,
    getProcessosRiscos, setProcessosRiscos, processosRiscos,
    getRiscosMedidas, setRiscosMedidas, riscosMedidas,
    getInventario, inventario,
    getGlobalSprm, setGlobalSprm, globalSprm, getGlobalSprmByRiscoId,
    getPlano, setPlano, plano,
    fetchContatos
  } = useAuth(null);
  const [onEdit, setOnEdit] = useState(null);
  const [nameCompany, setNameCompany] = useState(null);
	const [setores, setSetores] = useState([]);
	const [unidades, setUnidades] = useState([]);
  const [processos, setProcessos] = useState([]);
  const [contactInfo, setContactInfo] = useState([]);
  const [contatos,setContatos] = useState([]);
  const [medidas, setMedidas] = useState([]);


  
  useEffect(() => {
    handleSetCompanyId();
  }, []);

  const get = async () => {
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
  	}

	useEffect(() => {
		get();
    console.log(contatos)
	}, [companyId]);


  useEffect(() => {
    setNameCompany(selectedCompany[0]?.nome_empresa)
    getCargos();
    getRiscos();
    getSetoresProcessos();
    getProcessosRiscos();
    getInventario();
    getRiscosMedidas();
    getPlano();
    getGlobalSprm();
  }, [companyId]);


  useEffect(() => {
    console.log("Plano:", plano);
  }, [plano]);

  const handleEdit = (selectedInventario) => {
    setOnEdit(selectedInventario);
  };

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
        medidas = {medidas}
        getGlobalSprm={getGlobalSprm}
        setGlobalSprm={setGlobalSprm}
        globalSprm={globalSprm}
        getGlobalSprmByRiscoId={getGlobalSprmByRiscoId}
        getPlano={getPlano}
        contatos={contatos}
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
        />
      </div>
    </>
  )
}

export default Plano;