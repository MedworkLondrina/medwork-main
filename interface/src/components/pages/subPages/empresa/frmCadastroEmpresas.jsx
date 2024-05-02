//Importando Ferramentas
import { useRef, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { connect } from "../../../../services/api"; //Conexão com o banco de dados
import { IoIosHelpCircle } from "react-icons/io";

import ModarSearchContato from "../components/Modal/ModalSearchContato";
import icon_add from '../../../media/icon_add.svg'
import icon_sair from '../../../media/icon_sair.svg'


function CadastroEmpresa({ onEdit, setOnEdit, fetchEmpresas, contact }) {

  //Instanciando as Variáveis
  const ref = useRef(null);
  const [showModal, setShowModal] = useState(false); //Controlar o Modal
  const [contactId, setContactId] = useState(null); //Armazenar o Id do Contato recebido do Modal
  const [contactName, setContactName] = useState(null); //Armazenar o Nome do Contato Recebido do Modal
  const [checkedEstadual, setCheckedEstadual] = useState(false); //Armazena o estado do checkbox da Inscrição Estadual
  const [checkedMunicipal, setCheckedMunicipal] = useState(false); //Armazena o estado do checkbox da Inscrição Municipal
  const [cnpj, setCnpj] = useState(""); //Armazena o CNPJ
  const [cnae, setCnae] = useState(""); //Armazena o CNAE
  const [grauRisco, setGrauRisco] = useState(""); //Armazena o Grau de Risco
  const [descricao, setDescricao] = useState(""); //Armazena a Descrição
  const [contatoModal, setc] = useState([]); //Armazena os contatos do Modal

  // Colocando as informações do formulario nas variaveis
  useEffect(() => {
    if (onEdit) {
      const user = ref.current;
      const { nome_empresa, razao_social, cnpj_empresa, inscricao_estadual_empresa, inscricao_municipal_empresa } = user;

      nome_empresa.value = onEdit?.nome_empresa || "";
      razao_social.value = onEdit?.razao_social || "";
      setCnae(onEdit.cnae_empresa || '');
      setGrauRisco(onEdit.grau_risco_cnae || '')
      setDescricao(onEdit.descricao_cnae || '');
      setCnpj(onEdit?.cnpj_empresa || "");
      if (onEdit?.inscricao_estadual_empresa == 0 || "") {
        setCheckedEstadual(true);
      } else {
        inscricao_estadual_empresa.value = onEdit?.inscricao_estadual_empresa;
        setCheckedEstadual(false);
      }
      if (onEdit?.inscricao_municipal_empresa == 0 || "") {
        setCheckedMunicipal(true);
      } else {
        inscricao_municipal_empresa.value = onEdit?.inscricao_municipal_empresa;
        setCheckedMunicipal(false);
      }

      if (contact && onEdit?.fk_contato_id) {
        setContactName(contact.nome_contato);
        setContactId(contact.id_contato);
      } else {
        setContactName(null);
        setContactId(null);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [onEdit, contact]);
  const areFieldsFilled = () => {
    const user = ref.current;
    if (!user) return false; // Retorna false se user for null
    return user.nome_empresa.value && user.razao_social.value && user.cnpj_empresa.value && user.cnae_empresa.value && contatoModal.nome_contato;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user"));
    const tenant = userData.tenant_code;
    const nome = userData.nome_usuario;
    const queryParams = new URLSearchParams({ tenant_code: tenant, nome_usuario: nome }).toString();
    const user = ref.current;

    // Verifica se todos os campos foram preenchidos
    if (!user.nome_empresa.value || !user.razao_social.value || !user.cnpj_empresa.value || !user.cnae_empresa || !contatoModal.nome_contato) {
      return toast.warn("Preencha Todos os Campos!")
    }

    try {
      const empresaData = {
        nome_empresa: user.nome_empresa.value || null,
        razao_social: user.razao_social.value || null,
        cnpj_empresa: user.cnpj_empresa.value || null,
        inscricao_estadual_empresa: checkedEstadual ? "0" : user.inscricao_estadual_empresa.value || null,
        inscricao_municipal_empresa: checkedMunicipal ? "0" : user.inscricao_municipal_empresa.value || null,
        fk_contato_id: 1 || null,
        cnae_empresa: cnae || null,
        grau_risco_cnae: grauRisco || null,
        descricao_cnae: descricao || '',
        ativo: 1,
        fk_tenant_code: tenant
      };

      const juncao = {
        empresa_data: empresaData,
        contato_data: contatoModal,
      }

      const url = onEdit
        ? `${connect}/empresas/${onEdit.id_empresa}?${queryParams}`
        : `${connect}/empresas?${queryParams}`;

      const method = onEdit ? 'PUT' : 'POST';

      const empresaResponse = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(juncao)
      });

      if (!empresaResponse.ok) {
        throw new Error(`Erro ao cadastrar Empresa. Status: ${empresaResponse.status}`);
      }

      toast.success("Empresa cadastrada com sucesso!");

      handleClear();

      // Atualiza os dados
      fetchEmpresas();
    } catch (error) {
      console.log("Erro ao cadastrar empresa ou contato: ", error);
      toast.error("Erro ao cadastrar Empresa ou Contato!");
    }
  };

  //Função para limpar o formulário
  const handleClear = () => {
    // Limpa todos os campos do formulário
    const user = ref.current;
    user.nome_empresa.value = "";
    user.razao_social.value = "";
    user.inscricao_estadual_empresa.value = "";
    user.inscricao_municipal_empresa.value = "";
    setCnpj("");
    setContactId(null);
    setContactName(null);
    setCheckedEstadual(null);
    setCheckedMunicipal(null);
    setOnEdit(null);
    setCnae('');
    setGrauRisco('');
    setDescricao('');
  };

  //Funções do Modal
  //Função para abrir o Modal
  const openModal = () => setShowModal(true);
  //Função para fechar o Modal
  const closeModal = () => setShowModal(false);

  const handleContactSelect = useCallback((contato) => {
    if (contato) {
      closeModal();
      setc(contato); // Corrigido para atualizar o estado correto
      setContactId(contato.id_contato);
      setContactName(contato.nome_contato);
    }
  }, [closeModal, setc, setContactId, setContactName]);
  

  //Funções CheckBox
  const checkboxEstadual = () => {
    setCheckedEstadual(!checkedEstadual);
    const user = ref.current;
    user.inscricao_estadual_empresa.value = ""
  }

  const checkboxMunicipal = () => {
    setCheckedMunicipal(!checkedMunicipal);
    const user = ref.current;
    user.inscricao_municipal_empresa.value = ""
  }

  //Função para limpar o campo Contato
  const handleClearContato = () => {
    setContactId(null);
    setContactName(null);
  };

  //Funções para formatação do CNPJ
  const handleFormatCnpj = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const handlePasteCnpj = (event) => {
    const inputCnpj = event.clipboardData.getData('text/plain');
    const cnpjFormatado = handleFormatCnpj(inputCnpj);
    setCnpj(cnpjFormatado);
  };

  const handleCnpjChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    const truncatedValue = numericValue.slice(0, 14);
    const formattedCnpj = handleFormatCnpj(truncatedValue);

    if (formattedCnpj === inputValue) {
      setCnpj(inputValue);
    } else {
      setCnpj(formattedCnpj);
    }
  };

  //Funções para formatação do CNAE
  const handleFormatCnae = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(\d{1})(\d{2})/, '$1-$2/$3');
  };

  const handlePastCnae = async (event) => {
    await handleCnaeChange(event);
  };

  const handleCnaeChange = async (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    const truncatedValue = numericValue.slice(0, 7);
    const formatedCnae = handleFormatCnae(truncatedValue);
    setCnae(formatedCnae);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    const numberValue = parseInt(numericValue, 10);

    if (isNaN(numberValue) || numberValue < 0) {
      e.target.value = '';
    } else {
      e.target.value = numberValue;
    }
  };

  const handleBlurEstadual = (e) => {
    const inputValue = e.target.value;

    if (inputValue === '' || inputValue === 0) {
      setCheckedEstadual(true);
    } else {
      setCheckedEstadual(false);
    }
  };

  const handleBlurMunicipal = (e) => {
    const inputValue = e.target.value;

    if (inputValue === '' || inputValue === 0) {
      setCheckedMunicipal(true);
    } else {
      setCheckedMunicipal(false);
    }
  };

  const handleGrauChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    setGrauRisco(numericValue);
  };

  const handleDescricaoChange = (event) => {
    setDescricao(event.target.value)
  };

  return (
    <div className="flex justify-center">
      <form className="w-full max-w-5xl" ref={ref} onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6 p-3">

          {/* Nome Empresa */}
          <div className="w-full md:w-1/3 px-3">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="nome">
              Nome da Empresa:
            </label>
            <input
              className="appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
              id="nome"
              type="text"
              name="nome_empresa"
              placeholder="Nome da empresa"
            />
          </div>

          {/* Razão Social */}
          <div className="w-full md:w-1/3 px-3">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="razao_social">
              Razão Social:
            </label>
            <input
              className="appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
              id="razao_social"
              type="text"
              name="razao_social"
              placeholder="Razão Social da Empresa"
            />
          </div>

          {/* CNPJ */}
          <div className="w-full md:w-1/3 px-3">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="cnpj">
              CNPJ:
            </label>
            <input
              className="appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
              id="cnpj"
              type="text"
              name="cnpj_empresa"
              value={cnpj}
              onChange={handleCnpjChange}
              onPaste={handlePasteCnpj}
              maxLength={18}
              placeholder="00.000.000/0000-00"
            />
          </div>

          {/* Incrição Estadual */}
          <div className="w-full md:w-3/12 px-3">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="inscricao_estadual">
              Inscrição Estadual:
            </label>
            <input
              className={`appearence-none block w-full bg-gray-100 rounded py-3 px-4 mt-1 leading-tight focus:outline-gray-100 focus:bg-white ${checkedEstadual ? 'opacity-25' : 'bg-gray-100'}`}
              type="number"
              name="inscricao_estadual_empresa"
              id="inscricao_estadual"
              placeholder="Inscrição Estadual"
              disabled={checkedEstadual}
              onChange={handleInputChange}
              onInput={handleInputChange}
              onBlur={handleBlurEstadual}
            />
            <div className="flex items-center gap-2 mt-1 px-1">
              <input
                type="checkbox"
                id="estadualCheckbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                checked={checkedEstadual}
                onChange={checkboxEstadual}
              />
              <label className="text-sm font-ligth text-gray-500" htmlFor="estadualCheckbox">Isento</label>
            </div>
          </div>

          {/* Incrição Municipal */}
          <div className="w-full md:w-3/12 px-3">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="inscricao_municipal">
              Inscrição Municipal:
            </label>
            <input
              className={`appearence-none block w-full bg-gray-100 rounded py-3 px-4 mt-1 leading-tight focus:outline-gray-100 focus:bg-white ${checkedMunicipal ? 'opacity-25' : 'bg-gray-100'}`}
              type="number"
              name="inscricao_municipal_empresa"
              id="inscricao_municipal"
              placeholder="Inscrição Municipal"
              disabled={checkedMunicipal}
              onChange={handleInputChange}
              onInput={handleInputChange}
              onBlur={handleBlurMunicipal}
            />
            <div className="flex items-center gap-2 mt-1 px-1">
              <input
                type="checkbox"
                id="municipalCheckbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                checked={checkedMunicipal}
                onChange={checkboxMunicipal}
              />
              <label className="text-sm font-ligth text-gray-500" htmlFor="municipalCheckbox">Isento</label>
            </div>
          </div>

          {/* CNAE */}
          <div className={`w-full px-3 md:w-3/12`}>
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="cnae">
              CNAE:
            </label>
            <input
              className="appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
              type="text"
              name="cnae_empresa"
              id="cnae"
              value={cnae}
              onChange={handleCnaeChange}
              onPaste={handlePastCnae}
              maxLength={9}
              placeholder="0000-0/00"
            />
          </div>

          {/* Grau de Risco */}
          <div className={`w-full md:w-3/12 px-3`}>
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grau_risco">
              Grau de Risco:
            </label>
            <input
              className="appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
              id="grau_risco"
              type="text"
              name="grau_risco_empresa"
              value={grauRisco}
              onChange={handleGrauChange}
              placeholder="Grau de Risco CNAE"
            />
          </div>

          {/* Descrição */}
          <div className={`w-full md:w-8/12 px-3`}>
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="descricao">
              Descrição:
            </label>
            <textarea
              className="resize-none appearence-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
              id="descricao"
              type="text"
              name="descricao_cnae"
              value={descricao}
              onChange={handleDescricaoChange}
              placeholder="Descrição CNAE"
            />
          </div>

          {/* Contato */}
          <div className="w-full md:w-4/12 px-3">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-fk_contato_id">
              Contato:
            </label>
            <div className="flex items-center w-full">
              {contactName ? (
                <>
                  <button
                    className="w-full flex appearance-none hover:shadow-sm text-sky-600 bg-gray-100 border-gray-200 justify-center mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text"
                    type="button"
                    onClick={openModal}
                  >
                    <p className="font-bold">
                      {contactName}
                    </p>
                  </button>
                  <button className="ml-4" type="button" onClick={handleClearContato}>
                    <img src={icon_sair} alt="" className="h-8" />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 w-full">
                    <button
                      className="flex w-full appearance-none text-gray-400 bg-gray-100 border-gray-200 justify-center mt-1 py-3 px-4 rounded leading-tight focus:outline-none with-text"
                      type="button"
                      onClick={openModal}
                    >
                      <p className="px-2 text-sm font-medium">
                        Nenhum Contato Cadastrado
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={openModal}
                      className={`flex cursor-pointer`}
                    >
                      <img src={icon_add} className="h-9" alt="Icone adicionar usuario"></img>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Botões */}
          <div className="w-full px-3 pl-8 flex justify-end">
            <div>
              <button onClick={handleClear} className="shadow mt-4 bg-red-600 hover:bg-red-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
                Limpar
              </button>
            </div>
            <div className="px-3 pl-8">
            {!areFieldsFilled() ? (
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
      <ModarSearchContato
        isOpen={showModal}
        onCancel={closeModal}
        onContactSelect={handleContactSelect}
        contact={contact}
      />
    </div>
  )
}

export default CadastroEmpresa;