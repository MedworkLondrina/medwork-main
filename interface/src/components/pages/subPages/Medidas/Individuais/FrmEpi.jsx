//Importando Ferramentas
import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { connect } from "../../../../../services/api"; //Conexão com o banco de dados

function CadastroEpi({ onEdit, get, epis, setOnEdit }) {

  //Instanciando as Variáveis
  const ref = useRef(null); // Referência do formulario
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (onEdit) {
      setNome(onEdit.descricao_medida || "");
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onEdit]);

  const verify = async (medida) => {
    const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

    try {
      const verifyNome = epis.filter((i) => normalizeString(i.descricao_medida) === normalizeString(medida));
      if (verifyNome.length > 0) {
        return verifyNome;
      }
    } catch (error) {
      console.log("Erro ao verificar medidas EPI: ", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user"));
    const tenant = userData.tenant_code;
    const usuario = userData.nome_usuario;
    const queryParams = new URLSearchParams({ tenant_code: tenant, nome_usuario: usuario }).toString();

    //Verificandose todos os campos foram preenchidos
    if (!nome) {
      return toast.warn("Preencha Todos os Campos!")
    }
    try {

      const resVerify = await verify(nome);

      if (resVerify) {
        return toast.warn(`Uma medida com o mesmo nome foi encontrada`);
      }

      const medidasData = {
        descricao_medida: nome || null,
        grupo_medida: 'MI',
        tenant_code: tenant,
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

  const handleClear = () => {
    setNome('');
    setOnEdit(null);
  };

  return (
    <div className="flex justify-center mt-10">
      <form className="w-full max-w-5xl" ref={ref} onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6 p-3">

          {/* Nome */}
          <div className="w-full px-3">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="medida">
              Nome do EPI:
            </label>
            <input
              className="appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
              type="text"
              id="medida"
              name="medida"
              placeholder="Nome do EPI"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
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
              <button
                className="shadow mt-4 bg-green-600 hover:bg-green-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Cadastrar
              </button>

            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CadastroEpi;