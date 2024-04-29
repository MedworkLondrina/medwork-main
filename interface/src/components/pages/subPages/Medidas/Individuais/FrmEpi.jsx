//Importando Ferramentas
import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { connect } from "../../../../../services/api"; //Conexão com o banco de dados

function CadastroEpi({ onEdit, get, epis, setOnEdit }) {

  //Instanciando as Variáveis
  const ref = useRef(null); // Referência do formulario
  const [nome, setNome] = useState('');
  const [certificado, setCertificado] = useState('');
  const [fator, setFator] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [fabricante, setFabricante] = useState('');

  useEffect(() => {
    if (onEdit) {

      setNome(onEdit.descricao_medida || "");
      setCertificado(onEdit.certificado_medida || "");
      setFator(onEdit.fator_reducao_medida || "");

      try {
        // Formate a data para o formato 'YYYY-MM-DD' antes de atribuir ao campo
        setVencimento(onEdit.vencimento_certificado_medida
          ? new Date(onEdit.vencimento_certificado_medida).toISOString().split('T')[0]
          : "");
      } catch (error) {
        console.log("Erro ao formatar data para input.", error)
      }

      setFabricante(onEdit.fabricante_medida || "");
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onEdit]);

  const verify = async (medida, certificado) => {
    const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

    try {
      const verifyNome = epis.filter((i) => normalizeString(i.nome_medida) === normalizeString(medida));
      const verifyCa = verifyNome.filter((i) => i.certificado_medida.trim() == certificado.trim());
      if (verifyCa.length > 0) {
        return verifyCa;
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
    if (!nome || !certificado || !fator || !vencimento || !fabricante) {
      return toast.warn("Preencha Todos os Campos!")
    }
    try {

      const resVerify = await verify(nome, certificado);

      if (resVerify) {
        return toast.warn(`Uma medida com o mesmo C.A foi encontrada`);
      }

      const medidasData = {
        descricao_medida: nome || null,
        certificado_medida: certificado || null,
        fator_reducao_medida: fator || null,
        vencimento_certificado_medida: vencimento || null,
        fabricante_medida: fabricante || null,
        grupo_medida: 'MI',
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
    setCertificado('');
    setFator('');
    setVencimento('');
    setFabricante('');
    setOnEdit(null);
  };

  const handleVerifyCA = async (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    setCertificado(numericValue);
  };

  return (
    <div className="flex justify-center mt-10">
      <form className="w-full max-w-5xl" ref={ref} onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6 p-3">
          {/* Nome */}
          <div className="w-full md:w-1/3 px-3">
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
          {/* C.A */}
          <div className="w-full md:w-1/3 px-3">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="certificado">
              Certificado de Aprovação:
            </label>
            <input
              className="appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
              type="number"
              id="certificado"
              name="certificado_medida"
              placeholder="Certificado de Aprovação"
              value={certificado}
              onChange={handleVerifyCA}
              onPaste={handleVerifyCA}
            />
          </div>
          {/* Fator */}
          <div className="w-full md:w-1/3 px-3">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="fator">
              Fator de Redução:
            </label>
            <input
              className="appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
              type="text"
              id="fator"
              name="fator_reducao_medida"
              placeholder="Fator de Redução:"
              value={fator}
              onChange={(e) => setFator(e.target.value)}
            />
          </div>
          {/* Vencimento */}
          <div className="w-full md:w-1/3 px-3">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="vencimento">
              Vencimento do Certificado:
            </label>
            <input
              className="appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
              type="date"
              id="vencimento"
              name="vencimento_certificado_medida"
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
            />
          </div>
          {/* Fabricante */}
          <div className="w-full md:w-1/3 px-3">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="fabricante">
              Fabricante:
            </label>
            <input
              className="appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
              type="text"
              id="fabricante"
              name="fabricante_medida"
              placeholder="Fabricante do EPI"
              value={fabricante}
              onChange={(e) => setFabricante(e.target.value)}
            />
          </div>

          <div className="w-full px-3 pl-8 flex justify-end">
            <div>
              <button onClick={handleClear} className="shadow mt-4 bg-red-600 hover:bg-red-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
                Limpar
              </button>
            </div>
            <div className="px-3 pl-8">
              {!nome || !certificado || !fator || !vencimento || !fabricante ? (
                <button
                  className="shadow mt-4 bg-green-600 cursor-not-allowed opacity-50 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                  type="submit"
                  disabled
                >
                  Cadastrar
                </button>
              ) : (
                <button
                  className="shadow mt-4 bg-green-600 hover:bg-green-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                  type="submit"
                >
                  Cadastrar
                </button>
              )}

            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CadastroEpi;