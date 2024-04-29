import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";


function FrmCadastroContato({ setContatoData, onEdit, contact }) {

  const ref = useRef(null);

  const [showMailError1, setShowMailError1] = useState(false);
  const [showMailError2, setShowMailError2] = useState(false);

  useEffect(() => {
    if (onEdit) {
      const user = ref.current;

      user.nome_contato.value = onEdit.nome_contato;
      user.telefone_contato.value = onEdit.telefone_contato;
      user.email_contato.value = onEdit.email_contato;
      user.email_secundario_contato.value = onEdit.email_secundario_contato
    }
  }, [onEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = ref.current;

    if (
      !user.nome_contato.value) {
      return toast.warn("Preencha Todos os Campos!")
    }

    if (showMailError1 || showMailError2) {
      return toast.warn("Preencha os emails corretamente")
    };

    try {
      const contatoData = {
        nome_contato: user.nome_contato.value || '',
        telefone_contato: user.telefone_contato.value || '',
        email_contato: user.email_contato.value || '',
        email_secundario_contato: user.email_secundario_contato.value || '',
        ativo: 1,
      }
      setContatoData(contatoData);
    } catch (error) {
      console.log("Erro ao inserir ou atualizar contato!", error);
      toast.error("Erro ao inserir ou editar o contato. Verifique o console!");
    }

    handleClear();
  };

  const handleClear = () => {
    // Limpa todos os campos do formulário
    const user = ref.current;
    user.nome_contato.value = "";
    user.telefone_contato.value = "";
    user.email_contato.value = "";
    user.email_secundario_contato.value = "";
    setShowMailError1(false);
    setShowMailError2(false);
    // setOnEdit(null);
  };

  const handleInputChangePhone = (e) => {
    const inputValue = e.target.value;
    const phoneNumber = inputValue.replace(/\D/g, '');
    const formattedPhoneNumber = `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
    e.target.value = formattedPhoneNumber;
  };

  const handleInputChangeMail1 = (e) => {
    const inputValue = e.target.value;
    if (inputValue !== '') {
      const isValid = inputValue.includes('@') && inputValue.includes('.');
      setShowMailError1(!isValid);
      return
    }
    if (inputValue === '') {
      setShowMailError1(false);
    }
  };

  const handleInputChangeMail2 = (e) => {
    const inputValue = e.target.value;
    if (inputValue !== '') {
      const isValid = inputValue.includes('@') && inputValue.includes('.');
      setShowMailError2(!isValid);
      return
    }
    if (inputValue === '') {
      setShowMailError2(false);
    }
  };

  useEffect(() => {
    const user = ref.current;
    if (contact) {
      contact.nome_contato ? user.nome_contato.value = contact.nome_contato : user.nome_contato.value = '';
      contact.telefone_contato ? user.telefone_contato.value = contact.telefone_contato : user.telefone_contato.value = '';
      contact.email_contato ? user.email_contato.value = contact.email_contato : user.email_contato.value = '';
      contact.email_secundario_contato ? user.email_secundario_contato.value = contact.email_secundario_contato : user.email_secundario_contato.value = '';
    }
  }, [contact])


  return (
    <div className="flex justify-center">
      <form className="w-full" ref={ref} onSubmit={handleSubmit}>
        <div className="flex flex-wrap py-2 px-3">

          {/* Nome */}
          <div className="w-full">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="nome">
              Nome
            </label>
            <input
              className="apperance-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
              type="text"
              name="nome_contato"
              id="nome"
              placeholder="Nome do Contato"
            />
          </div>

          {/* Telefone */}
          <div className="w-full">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="telefone">
              Telefone
            </label>
            <input
              className="apperance-none block w-full bg-gray-100 rounded py-3 px-4 mb-3 mt-1 leading-tight focus:outline-gray-100 focus:bg-white"
              id="telefone"
              type="text"
              autoComplete="phone"
              name="telefone_contato"
              onInput={handleInputChangePhone}
              placeholder="Telefone para Contato"
            />
          </div>

          {/* Email */}
          <div className="w-full">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className={`apperance-none block w-full bg-gray-100 rounded py-3 px-4 mt-1 leading-tight focus:outline-gray-100 focus:bg-white ${showMailError1 ? "" : "mb-3"}`}
              type="text"
              id="email"
              name="email_contato"
              onChange={handleInputChangeMail1}
              placeholder="Email para Contato"
              autoComplete="email"
            />
            <p className={`text-xs font-medium text-red-600 px-1 mt-1 ${showMailError1 ? "block" : "hidden"}`}>*Email Incompleto</p>
          </div>

          {/* Email Secundario */}
          <div className="w-full">
            <label className="tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email_sec">
              Email Secundário
            </label>
            <input
              className={`apperance-none block w-full bg-gray-100 rounded py-3 px-4 mt-1 leading-tight focus:outline-gray-100 focus:bg-white ${showMailError2 ? "" : "mb-3"}`}
              type="text"
              id="email_sec"
              autoComplete="email"
              name="email_secundario_contato"
              onChange={handleInputChangeMail2}
              placeholder="Email para Contato"
            />
            <p className={`text-xs font-medium text-red-600 px-1 mt-1 ${showMailError2 ? "block" : "hidden"}`}>*Email Incompleto</p>
          </div>

          {/* Botões */}
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
                className={`shadow mt-4 bg-green-600  focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ${showMailError1 || showMailError2 ? "cursor-not-allowed opacity-25" : "hover:bg-green-700"}`}
                type="submit"
                disabled={showMailError1 && showMailError2}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default FrmCadastroContato;