import React, { useState, useEffect, useRef } from "react";
import { connect } from "../../../../../services/api";
import { toast } from "react-toastify";

function ModalEpi({ isOpen, onCancel, idGlobal, globalData }) {

  const ref = useRef(null);

  const [certificado, setCertificado] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [fatorReducao, setFatorReducao] = useState('');
  const [fabricante, setFabricante] = useState('');

  useEffect(() => {
    if (globalData) {
      setCertificado(globalData.certificado_epi);
      setVencimento(globalData.vencimento_certificado_epi);
      setFatorReducao(globalData.fator_reducao_epi);
      setFabricante(globalData.fabricante_epi);
    }
  }, [globalData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const epiData = {
      certificado_epi: certificado,
      vencimento_certificado_epi: vencimento,
      fator_reducao_epi: fatorReducao,
      fabricante_epi: fabricante
    };

    const response = await fetch(`${connect}/update_epi_sprm/${idGlobal}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(epiData),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar EPI sprm. Status: ${response.status}`)
    }

    const responseData = await response.json();
    toast.success(responseData);
    handleClear();
    onCancel();
  };

  const handleClear = () => {
    setCertificado('');
    setVencimento('');
    setFatorReducao('');
    setFabricante('');
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="modal-overlay absolute inset-0 backdrop-blur-[1px] bg-black bg-opacity-10" onClick={onCancel}></div>
        <div className="modal-container w-4/6 bg-white mx-auto rounded-xl z-50 overflow-y-auto px-8 py-4 max-h-[80vh]">
          <div className='flex justify-between items-center py-2'>
            <h1 className='text-xl font-bold text-sky-700'>Cadastro do EPI</h1>
          </div>
          <hr className="mb-2" />
          <div className="flex justify-center">
            <form className="w-full" ref={ref} onSubmit={handleSubmit}>
              <div className="flex flex-wrap py-2 px-3">

                {/* C.A */}
                <div className="w-full md:w-1/2 px-3">
                  <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="nome">
                    Certificado de Aprovação (C.A)
                  </label>
                  <input
                    className="apperance-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
                    type="text"
                    name="nome_contato"
                    id="nome"
                    placeholder="Nome do Contato"
                    value={certificado}
                    onChange={(e) => setCertificado(e.target.value)}
                  />
                </div>

                {/* Vencimento C.A */}
                <div className="w-full md:w-1/2 px-3">
                  <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="vencimento">
                    Vencimento Certificado
                  </label>
                  <input
                    className="apperance-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
                    type="date"
                    name="vencimento"
                    id="vencimento"
                    value={vencimento}
                    onChange={(e) => setVencimento(e.target.value)}
                  />
                </div>

                {/* Fator de Redução */}
                <div className="w-full md:w-1/2 px-3">
                  <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="reducao">
                    Fator de Redução
                  </label>
                  <input
                    className="apperance-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
                    type="text"
                    name="reducao"
                    id="reducao"
                    placeholder="Fator de Redução"
                    value={fatorReducao}
                    onChange={(e) => setFatorReducao(e.target.value)}
                  />
                </div>

                {/* Fabricante EPI */}
                <div className="w-full md:w-1/2 px-3">
                  <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="fabricante">
                    Fabricante
                  </label>
                  <input
                    className="apperance-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
                    type="text"
                    name="fabricante"
                    id="fabricante"
                    placeholder="Fabricante do EPI"
                    value={fabricante}
                    onChange={(e) => setFabricante(e.target.value)}
                  />
                </div>

                <div className="w-full flex justify-end gap-2">
                  {/* Limpar */}
                  <div>
                    <button onClick={handleClear} className="shadow mt-4 bg-red-600 hover:bg-red-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
                      Limpar
                    </button>
                  </div>

                  {/* Salvar */}
                  <div>
                    <button
                      className={`shadow mt-4 bg-green-600  focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`}
                      type="submit"
                    >
                      Salvar
                    </button>
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalEpi;