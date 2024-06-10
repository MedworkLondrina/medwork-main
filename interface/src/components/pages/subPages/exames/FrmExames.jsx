//Importando Ferramentas
import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { connect } from "../../../../services/api";

import ModalSearchCnae from "../components/Modal/ModalSearchCnae";
import icon_lupa from '../../../media/icon_lupa.svg';
import icon_add from '../../../media/icon_add.svg';

function FrmExames({ onEdit, getExames, setOnEdit, setSearchTerm, exames, setVerify }) {

  //Instanciando as Variáveis
  const ref = useRef(null);
  const [nomeExame, setNomeExame] = useState('');
  const [periodicidade, setPeriodicidade] = useState('');
  const [admissional, setAdmissional] = useState(false);
  const [periodico, setPeriodico] = useState(false);
  const [retorno, setRetorno] = useState(false);
  const [mudanca, setMudanca] = useState(false);
  const [demissional, setDemissional] = useState(false);
  

  useEffect(() => {
    if (onEdit) {
      setNomeExame(onEdit.nome_exame);
      setPeriodicidade(onEdit.periodicidade_exame);
      setAdmissional(onEdit.admissional);
      setPeriodico(onEdit.periodico);
      setRetorno(onEdit.retorno);
      setMudanca(onEdit.mudanca);
      setDemissional(onEdit.demissional);
    }
  }, [onEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user"));
    const tenant = userData.tenant_code;
    const nome = userData.nome_usuario;
    const queryParams = new URLSearchParams({ tenant_code: tenant, nome_usuario: nome }).toString();
    try {
      if (!nomeExame || !periodicidade || !admissional && !periodico && !retorno && !mudanca && !demissional) {
        return toast.warn('Preencha todos os campos!');
      }

      const exameData = {
        nome_exame: nomeExame,
        periodicidade_exame: periodicidade,
        admissional: admissional ? 1 : 0,
        periodico: periodico ? 1 : 0,
        retorno: retorno ? 1 : 0,
        mudanca: mudanca ? 1 : 0,
        demissional: demissional ? 1 : 0,
        fk_tenant_code: tenant
      }

      const res = await fetch(`${connect}/exames`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exameData),
      });

      if (!res.ok) {
        throw new Error(`Erro ao inserir exame. Status: ${res.status}`);
      }

      const data = await res.json();
      toast.success(data);
      handleClear();
    } catch (error) {
      console.error(`Erro ao inserir exame. Status${error}`);
    }
  }


  const handleClear = () => {
    setNomeExame('');
    setPeriodicidade(0);
    setAdmissional(false);
    setPeriodico(false);
    setRetorno(false);
    setMudanca(false);
    setDemissional(false);
  }

  return (
    <div className="flex justify-center">
      <form className="w-full max-w-5xl" ref={ref} onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6 p-3">
          {/* Nome */}
          <div className="w-full md:w-1/2 px-3">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-nome_empresa">
              Nome do Exame
            </label>
            <input
              className="appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
              type="text"
              name="nome_processo"
              placeholder="Nome do Processo"
              onChange={(e) => setNomeExame(e.target.value)}
              value={nomeExame}
            />
          </div>

          {/* Periodicidade */}
          <div className="w-full md:w-1/2 px-3">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-raza_social">
              Periodicidade:
            </label>
            <select
              className="appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
              name="tipo"
              onChange={(e) => setPeriodicidade(e.target.value)}
              value={periodicidade}
            >
              <option value="0">Selecione uma Periodicidade</option>
              <option value="6 Meses">6 Meses</option>
              <option value="12 Meses">12 Meses</option>
              <option value="24 Meses">24 Meses</option>
              <option value="36 Meses">36 Meses</option>
            </select>
          </div>


          {/* Tipo */}
          <div className="px-3">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="tipo">
              Tipo:
            </label>
            <ul id="tipo" class="space-x-4 px-3 items-center text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-md sm:flex">
              {/* Admissional */}
              <li class="border-b border-gray-200 sm:border-b-0">
                <div class="flex items-center ps-3">
                  <input id="admissional-checkbox-list" type="checkbox" checked={admissional} value={admissional} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" onChange={() => setAdmissional(!admissional)} />
                  <label for="admissional-checkbox-list" class="py-3 ms-2 text-sm font-medium text-gray-700">Admissional</label>
                </div>
              </li>
              {/* Periódico */}
              <li class="border-b border-gray-200 sm:border-b-0">
                <div class="flex items-center ps-3">
                  <input id="periodico-checkbox-list" type="checkbox" checked={periodico} value={periodico} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" onChange={() => setPeriodico(!periodico)} />
                  <label for="periodico-checkbox-list" class="py-3 ms-2 text-sm font-medium text-gray-700">Periódico</label>
                </div>
              </li>
              {/* Retorno ao Trabalho */}
              <li class="border-b border-gray-200 sm:border-b-0">
                <div class="flex items-center ps-3">
                  <input id="retorno-checkbox-list" type="checkbox" checked={retorno} value={retorno} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" onChange={() => setRetorno(!retorno)} />
                  <label for="retorno-checkbox-list" class="py-3 ms-2 text-sm font-medium text-gray-700">Retorno ao Trabalho</label>
                </div>
              </li>
              {/* Mudança de Risco */}
              <li class="border-b border-gray-200 sm:border-b-0">
                <div class="flex items-center ps-3">
                  <input id="mudanca-checkbox-list" type="checkbox" checked={mudanca} value={mudanca} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" onChange={() => setMudanca(!mudanca)} />
                  <label for="mudanca-checkbox-list" class="py-3 ms-2 text-sm font-medium text-gray-700">Mudança de Risco</label>
                </div>
              </li>
              {/* Demissional */}
              <li class="border-b border-gray-200 sm:border-b-0">
                <div class="flex items-center ps-3">
                  <input id="demissional-checkbox-list" type="checkbox" checked={demissional} value={demissional} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" onChange={() => setDemissional(!demissional)} />
                  <label for="demissional-checkbox-list" class="py-3 ms-2 text-sm font-medium text-gray-700">Demissional</label>
                </div>
              </li>
            </ul>
          </div>


          {/* Botões Formulário */}
          <div className="w-full flex justify-end gap-3 px-3">
            <div>
              <button onClick={handleClear} className="shadow mt-4 bg-red-600 hover:bg-red-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
                Limpar
              </button>
            </div>
            <div className="">
              <button className="shadow mt-4 bg-green-600 hover:bg-green-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default FrmExames;