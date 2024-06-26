import React, { useEffect, useState } from "react";
import useAuth from "../../../../../hooks/useAuth";
import { IoClose } from "react-icons/io5";
import icon_setor from '../../../../media/icon_setor.svg'
import icon_processos from '../../../../media/icon_processos.svg'

import ModalSearchSetor from "../../components/Modal/ModalSearchSetor";
import GridModalSetorProcessos from '../../components/gridsModal/GridModalSetorProcessos'


function SetoresProcessos() {

  const { getSetores,  getUnidades, unidades, loadSelectedCompanyFromLocalStorage } = useAuth(null);

  const [showModalSetor, setShowModalSetor] = useState(false);
  const [showModalProcessos, setShowModalProcessos] = useState(false);
  const [setorNome, setSetorNome] = useState(null);
  const [setorId, setSetorId] = useState(null);
	const { fetchSetores,companyId} = useAuth(null);
  const [setores, setSetores] = useState([]);
  const [filteredSetores, setFilteredSetores] = useState([]);

  useEffect(() => {
    loadSelectedCompanyFromLocalStorage();
  }, [])

  const get = async () => {
		const sectors = await fetchSetores();
		console.log(sectors)
		setSetores(sectors);
  }

	useEffect(() => {
		get();
	}, [companyId]);

  useEffect(() => {
    getUnidades();
  }, [companyId])

  useEffect(() => {
    getSetores();

    if (setores) {
      const unidadesMap = unidades.map((i) => i.id_unidade);
      const filtersetor = setores.filter((i) => unidadesMap.includes(i.fk_unidade_id));
      setFilteredSetores(filtersetor);
    } else {
      console.error("Erro ao filtrar Setores");
    }
  }, [unidades]);

  const openModalSetor = () => setShowModalSetor(true);
  const closeModalSetor = () => setShowModalSetor(false);


  const handleClearSetor = () => {
    setSetorNome(null);
    setSetorId(null);
    closeModalSetor();
  }

  const handleSetorSelect = (SetorId, SetorName) => {
    closeModalSetor();
    setSetorId(SetorId)
    setSetorNome(SetorName)
  };

  return (
    <>
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-lg">
          {setorNome ? (
            <div className="flex justify-center mb-6">
              <h3 className="text-3xl font-bold text-sky-700">Vincule processos a esse setor</h3>
            </div>
          ) : (
            <div className="flex justify-center mb-6">
              <h3 className="text-3xl font-bold text-sky-700">Selecione um Setor</h3>
            </div>
          )}
          <div className="px-6">
            <div>
              {setorNome ? (
                <div className="mb-6">
                  <p>Setor selecionado:</p>
                  <div className="flex gap-2 items-center">
                    <div
                      className="w-full bg-gray-100 shadow-md rounded-md px-2 justify-center flex py-2 text-sky-700 font-bold text-sm cursor-pointer"
                      onClick={handleClearSetor}
                    >
                      <h3>{setorNome}</h3>
                    </div>
                    <IoClose className="text-2xl cursor-pointer" onClick={handleClearSetor} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p>Setor selecionado:</p>
                    <div className="w-full bg-gray-100 shadow-md rounded-md px-2 justify-center flex py-2 text-sky-700 font-bold text-sm">
                      <h3>Nenhum Setor Selecionado</h3>
                    </div>
                  </div>
                  <div
                    onClick={openModalSetor}
                    className="bg-gray-100 w-full cursor-pointer rounded-md shadow-md flex flex-col justify-center items-center py-2"
                  >
                    <img src={icon_setor} />
                    <p className="text-sm font-medium">Selecione um Setor</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          {setorNome ? (
            <GridModalSetorProcessos
              setor={setores}
              setorName={setorNome}
              setorId={setorId}
            />
          ) : (
            null
          )}
        </div>
      </div>
      <ModalSearchSetor
        isOpen={showModalSetor}
        onCancel={closeModalSetor}
        setores = {setores}
        onContactSelect={handleSetorSelect}
      />
    </>
  )
}

export default SetoresProcessos;