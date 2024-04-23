import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAuth from '../../../../../hooks/useAuth';

import FrmEpi from './FrmEpi'
import GridEpi from './GridEpi'
import SearchInput from "../../components/SearchInput";

function Epi() {

  const {fetchMedidas} = useAuth(null);

  const [onEdit, setOnEdit] = useState(null);
  const [medidas, setMedidas] = useState([]);

  //Instanciando o Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState([]);

  const get = async () => {
    const med = await fetchMedidas('MI');
    setMedidas(med);
  }

  useEffect(() => {
    get();
  }, []);

  const handleEdit = (item) => {
    setOnEdit(item);
  };

  //Função para Pesquisa
  useEffect(() => {
    const filtered = medidas.filter((epi) => epi.descricao_medida && epi.descricao_medida.toLowerCase().includes(searchTerm.toLowerCase()));
    setFiltered(filtered);
  }, [searchTerm, medidas]);


  const handleSearch = (term) => {
    // Atualizar o estado do termo de pesquisa com o valor fornecido
    setSearchTerm(term);
  }

  return (
    <>
      <FrmEpi
        onEdit={onEdit}
        get={get}
        epis={medidas}
        setOnEdit={setOnEdit}
      />

      <div className="flex justify-center w-full">
        <div className="w-3/6">
          <SearchInput onSearch={handleSearch} placeholder="Buscar Medidas Individuais..." />
        </div>
      </div>

      <GridEpi
        epis={filtered}
        setOnEdit={handleEdit}
      />
    </>
  )
}

export default Epi;