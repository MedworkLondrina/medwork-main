//Importando Ferramentas
import React, { useEffect, useState } from "react";
import useAuth from '../../../../../hooks/useAuth';

//Importando componentes
import CadastroTreinamentos from "./frmTreinamentos";
import GridTreinamentos from './GridTreinamentos';
import SearchInput from "../../components/SearchInput";

function Treinamentos() {

  const { fetchMedidas } = useAuth(null);
  const [medidas, setMedidas] = useState([]);

  // Instanciando e Definindo como vazio
  const [onEdit, setOnEdit] = useState(null);

  //Instanciando o Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState([]);

  const get = async () => {
    const med = await fetchMedidas('TR');
    setMedidas(med);
  }

  useEffect(() => {
    get();
  }, []);

  const handleEdit = (selected) => {
    setOnEdit(selected);
  };

  //Função para Pesquisa
  useEffect(() => {
    const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
    const filtered = medidas.filter((mp) => normalizeString(mp.descricao_medida).includes(normalizeString(searchTerm)));
    setFiltered(filtered);
  }, [searchTerm, medidas]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  }

  return (
    <div className="tab-content mt-14 mb-32">

      <CadastroTreinamentos
        onEdit={onEdit}
        setOnEdit={setOnEdit}
        get={get}
        medidas={medidas}
      />

      {/* Barra de pesquisa */}
      <div className="flex justify-center w-full">
        <div className="w-3/6">
          <SearchInput onSearch={handleSearch} placeholder="Buscar Treinamentos..." />
        </div>
      </div>

      {/* Tabela Empresa */}
      <GridTreinamentos
        children={filtered}
        setOnEdit={handleEdit}
      />
    </div>
  )
}

export default Treinamentos;
