//Importando Ferramentas
import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { connect } from "../../../../services/api";

import ModalSearchCnae from "../components/Modal/ModalSearchCnae";
import icon_lupa from '../../../media/icon_lupa.svg';

function CadastroProcesso({ onEdit, getProcessos, setOnEdit, setSearchTerm, processos }) {

  //Instanciando as Variáveis
  const ref = useRef(null); // Referência do formulario
  const [processo, setProcesso] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCnaes, setSelectedCnaes] = useState([]);

  // Colocando as informações do formulario nas variaveis
  useEffect(() => {
    const user = ref.current;

    if (onEdit) {
      const { nome_processo, ramo_trabalho } = user;

      nome_processo.value = onEdit.nome_processo || "";
      ramo_trabalho.value = onEdit.ramo_trabalho || "";

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

  }, [onEdit]);

  const verifyProcessRegister = async (processo) => {
    const normalizeString = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
    getProcessos();

    try {
      const process = processos.filter((proc) => normalizeString(proc.nome_processo) === normalizeString(processo));

      if (process.length > 0) {
        return process;
      }
    } catch (error) {
      console.error(`Erro ao verificar registro do processo ${processo}!`, error)
    }
  };

  //Função para adicionar ou atualizar dados
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user"));
    const tenant = userData.tenant_code;
    const nome = userData.nome_usuario;
    const queryParams = new URLSearchParams({ tenant_code: tenant, nome_usuario: nome }).toString();
    const user = ref.current;

    //Verificandose todos os campos foram preenchidos
    if (
      !processo || selectedCnaes.length === 0) {
      return toast.warn("Preencha Todos os Campos!")
    }
    try {

      // const resVerify = await verifyProcessRegister(user.nome_processo.value);

      // if (resVerify) {
      //   return toast.warn(`Já existem processos cadastrados com esse nome: ${user.nome_processo.value}!`);
      // }

      const processoData = {
        nome_processo: processo || null,
      };

      const url = onEdit
        ? `${connect}/processos/${onEdit.id_processo}?${queryParams}`
        : `${connect}/processos?${queryParams}`

      const method = onEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processoData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao cadastrar/Editar processo. Status: ${response.status}`);
      }

      const responseData = await response.json();
      const processoId = responseData.id;

      toast.success("Processo cadastrado com sucesso!");

      // Vincular os cnaes
      for (const cnae of selectedCnaes) {
        const cnaeData = {
          fk_processo_id: processoId,
          fk_cnae_id: cnae.id_cnae,
        };

        const cnaeResponse = await fetch(`${connect}/processo_cnae?${queryParams}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cnaeData),
        });

        if (!cnaeResponse.ok) {
          throw new Error(`Erro ao cadastrar cnae. Status: ${cnaeResponse.status}`);
        }

        toast.success(`Cnae ${cnae.subclasse_cnae} vinculado com sucesso!`);
        //Limpa os campos e reseta o estaodo de edição
        handleClear();

        //Atualiza os dados
        getProcessos();
      }
    } catch (error) {
      toast.error("Erro ao cadastrar ou editar processo!")
      console.log("Erro ao cadastrar ou editar processo: ", error);
    }

  };

  //Função para limpar o formulário
  const handleClear = () => {
    setProcesso('');
    setOnEdit(null);
    setSearchTerm('');
    setSelectedCnaes([]);
  };

  const handleSearchProcesso = (e) => {
    const term = e.target.value;
    setProcesso(term);
    if (!term) {
      setSearchTerm('');
    }
    setSearchTerm(term);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const onSelectedCnaes = (cnaes) => {
    setSelectedCnaes(cnaes);
  };

  return (
    <div className="flex justify-center">
      <form className="w-full max-w-5xl" ref={ref} onSubmit={handleSubmit}>
        <div className="-mx-3 mb-6 p-3">
          {/* Campos Formulário */}
          <div className={`flex ${selectedCnaes.length > 0 ? 'flex-wrap' : ''}`}>
            {/* Nome */}
            <div className="w-full md:w-1/2 px-3">
              <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-nome_empresa">
                Nome do Processo
              </label>
              <input
                className="appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
                type="text"
                name="nome_processo"
                placeholder="Nome do Processo"
                onChange={handleSearchProcesso}
                value={processo}
              />
            </div>
            {/* Cnae */}
            <div className={`w-full ${selectedCnaes.length > 0 ? 'md:w-full' : 'md:w-1/2'} px-3`}>
              <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-fk_contato_id">
                {selectedCnaes.length > 0 ? `CNAE's Selecionados` : `Selecione os CNAE's`}:
              </label>
              <div className="flex items-center w-full">
                {selectedCnaes.length > 0 ? (
                  <>
                    <div className="w-full">
                      <button
                        className={`flex appearance-none text-sky-600 mt-1 rounded leading-tight focus:outline-none with-text ${selectedCnaes ? 'w-full' : 'bg-gray-100 border border-gray-200 py-3 px-4 hover:shadow-sm'}`}
                        type="button"
                        onClick={openModal}
                      >
                        <div
                          className={`w-full grid gap-2 ${selectedCnaes.length === 1 ? 'grid-cols-2' :
                            selectedCnaes.length === 2 ? 'grid-cols-2' :
                              selectedCnaes.length === 3 ? 'grid-cols-3' : 'grid-cols-4'
                            }`}
                        >
                          {selectedCnaes.map((item, i) => (
                            <>
                              <div className="col-span-1 shadow-md rounded px-3 py-2">
                                <div className='grid grid-cols-12'>
                                  <div className="col-span-11">
                                    <p className="font-bold text-left text-sky-700">
                                      {item.subclasse_cnae}
                                    </p>
                                  </div>
                                  <div className='col-span-1'>
                                    <p className='font-bold text-sky-700 text-right'>
                                      {item.grau_risco_cnae}
                                    </p>
                                  </div>
                                </div>
                                <div className='border-gray-300 border-b mb-2'></div>
                                <div className='text-left'>
                                  <p className="text-gray-700 text-xs font-light">Descrição:</p>
                                  <p className='text-gray-800 text-sm'>{item.descricao_cnae}</p>
                                </div>
                              </div>
                            </>
                          ))}
                        </div>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-2 w-full items-center">
                      <button
                        className="flex w-full appearance-none text-gray-400 bg-gray-100 border-gray-200 justify-center mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text"
                        type="button"
                        onClick={openModal}
                      >
                        <p className="px-2 text-sm font-medium">
                          Nenhum CNAE Selecionado
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={openModal}
                        className={`flex cursor-pointer ml-4`}
                      >
                        <img src={icon_lupa} className="h-9" alt="Icone adicionar usuario"></img>
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>
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
      {/* Modais */}
      <ModalSearchCnae
        isOpen={showModal}
        onCancel={closeModal}
        processoNome={processo}
        onSelect={onSelectedCnaes}
      />
    </div>
  )
}

export default CadastroProcesso;