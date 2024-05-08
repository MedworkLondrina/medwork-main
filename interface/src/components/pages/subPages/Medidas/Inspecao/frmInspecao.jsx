import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { connect } from "../../../../../services/api"; //Conexão com o banco de dados


function CadastroColetivas({ onEdit, setOnEdit, get, medidas }) {

  const ref = useRef(null);

  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    if (onEdit) {
      setDescricao(onEdit.descricao_medida || '');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onEdit]);

  const verify = async (medida) => {
    const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

    try {
      const measure = medidas.filter((med) => normalizeString(med.descricao_medida) === normalizeString(medida));

      if (measure.length > 0) {
        return measure;
      }

    } catch (error) {
      console.error(`Erro ao buscar dados da Medida: ${medida}`, error)
    }
  }

  //Função para adicionar ou atualizar dados
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user"));
    const tenant = userData.tenant_code;
    const nome = userData.nome_usuario;
    const queryParams = new URLSearchParams({ tenant_code: tenant, nome_usuario: nome }).toString();

    //Verificandose todos os campos foram preenchidos
    if (!descricao) {
      return toast.warn("Preencha Todos os Campos!")
    }
    try {

      const resVerify = await verify(descricao);

      if (resVerify) {
        return toast.warn(`Uma medida com a mesma descrição foi encontrada`);
      }

      const medidasData = {
        descricao_medida: descricao || null,
        grupo_medida: 'IN',
        tenant_code: tenant
      };

      const url = onEdit
        ? `${connect}/medidas/${onEdit.id_medida}`
        : `${connect}/medidas?${queryParams}`;

      const method = onEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medidasData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao cadastrar/editar medida. Status: ${response.status}`);
      }

      const responseData = await response.json();

      toast.success(responseData);
    } catch (error) {
      toast.error("Erro ao cadastrar ou editar medida")
      console.log("Erro ao cadastrar ou editar medida: ", error);
    }

    handleClear();

    //Atualiza os dados
    get();
  };

  //Função para limpar o formulário
  const handleClear = () => {
    setDescricao('');
    setOnEdit(null)
  };


  return (
    <div className="flex justify-center mt-10">
      <form className="w-full max-w-5xl" ref={ref} onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6 p-3">
          {/* Descrição */}
          <div className="w-full px-3">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="inspecao">
              Descrição da Inspeção
            </label>
            <textarea
              className="resize-none appearence-none block w-full bg-gray-100 h-20 min-h-20 max-h-20 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
              type="text"
              id="inspecao"
              name="descricao_medida_adm"
              placeholder="Descreva a Inspeção..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="w-full px-3 pl-8 flex justify-end">
            <div>
              <button onClick={handleClear} className="shadow mt-4 bg-red-600 hover:bg-red-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
                Limpar
              </button>
            </div>
            <div className="px-3 pl-8">
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

export default CadastroColetivas;