import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail, updateEmail, sendEmailVerification, verifyBeforeUpdateEmail, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { IoClose, IoLogOut } from "react-icons/io5";
import { connect } from "../../../services/api";
import useAuth from "../../../hooks/useAuth";
import { FaUserEdit } from "react-icons/fa";

function ProfileUser({ user }) {

  const navigate = useNavigate();

  const { clearUser } = useAuth();

  const auth = getAuth();
  const usuario = auth.currentUser;
  const [novoEmail, setNovoEmail] = useState("");
  const [novoNomeUsuario, setNovoNomeUsuario] = useState("");
  const [invalidMail, setInvalidMail] = useState(false);
  const validado = usuario.emailVerified;
  const [edit, setEdit] = useState(false);

  useEffect(() => {

  }, [user]);

  const handleMudarEmail = async () => {
    if (!novoEmail) {
      toast.error("Por favor, insira um novo email.");
    }
    try {
      await verifyBeforeUpdateEmail(usuario, novoEmail);
      await handleMudarLocal();
      toast.success("Verifique seu e-mail para atualizar!");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error("Erro ao enviar o email: " + errorMessage);
    }
  };

  const handleValidarEmail = () => {
    sendEmailVerification(usuario)
      .then(() => {
        toast.success("Email enviado com sucesso!");
        setNovoEmail("");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("Erro ao enviar o email: " + errorMessage);
      });
  };

  const handleMudarLocal = async () => {
    try {
      const tenant_code = user.tenant_code;
      const queryParams = new URLSearchParams({ tenant_code: tenant_code }).toString();

      const url = `${connect}/usuarios_email/${user.id_usuario}/?${queryParams}`

      const method = "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: novoEmail }),
      });

      if (!response.ok) {
        toast.error("Erro ao Alterar o Email!")
        throw new Error(`Erro ao cadastrar/editar Setor. Status: ${response.status}`);
      }

      const responseData = await response.json();

      toast.success(responseData);
    } catch (error) {
      toast.error("Erro ao salvar o registro");
    }
  }

  const handleMudarSenha = () => {
    sendPasswordResetEmail(auth, usuario.email)
      .then(() => {
        toast.success("Email para redefinir senha enviado com sucesso!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("Erro ao enviar o email!");
        console.error('Código de Erro: ', errorCode, 'Mensagem de Erro: ', errorMessage);
      });
  };

  const handleEditUser = () => {
    setEdit(!edit);
  };

  const handleEmailChange = (e) => {
    const inputValue = e.target.value;
    usuario.email = inputValue;
    setNovoEmail(inputValue);
  };

  const logout = () => {
    try {
      clearUser();
      navigate("/login");
    } catch (error) {
      console.log("Erro ao deslogar!", error)
    }
  };

  const handleNameChange = (e) => {
    const inputValue = e.target.value;
    setNovoNomeUsuario(inputValue);
    user.nome_usuario = inputValue;
  };


  return (
    <div className="bg-sky-600 rounded-md px-4 py-2">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-bold text-lg">Informações do Usuário</h2>
        <div className="flex">
          <div className="text-white px-1 py-1 rounded hover:bg-sky-700 cursor-pointer" onClick={handleEditUser}>
            <FaUserEdit />
          </div>
          <div className="text-white px-1 py-1 rounded hover:bg-sky-700 cursor-pointer" onClick={logout}>
            <IoLogOut />
          </div>
        </div>
      </div>
      <form onSubmit={handleMudarEmail}>
        {/* Usuario */}
        <div className={`w-full flex items-center gap-1 ${edit ? 'mt-1 mb-2' : ''}`}>
          <label className="w-1/6 text-white text-sm" htmlFor="usuario">
            Usuário:
          </label>
          <input
            className={`${edit ? 'appearence-none block w-5/6 bg-gray-100 rounded py-1 px-2' : 'appearence-none bg-transparent border-transparent text-white text-base font-bold'}`}
            id="usuario"
            type="text"
            name="nome_usuario"
            value={user.nome_usuario}
            onChange={(e) => handleNameChange(e)}
            disabled={!edit}
          />
        </div>
        {/* Email */}
        <div className={`w-full flex items-center gap-1 ${edit ? 'mt-1 mb-2' : '-mt-1'}`}>
          <label className="w-1/6 text-white text-sm" htmlFor="usuario">
            E-mail:
          </label>
          <input
            className={`${edit ? 'appearence-none block w-5/6 bg-gray-100 rounded py-1 px-2' : 'appearence-none bg-transparent border-transparent text-white text-base font-bold'}`}
            id="usuario"
            type="text"
            name="nome_usuario"
            value={usuario.email}
            disabled={!edit}
            onChange={(e) => handleEmailChange(e)}
          />
        </div>
        {/* Botões */}
        {edit && (
          <div className="w-full flex justify-between items-center gap-2">
            <div>
              <button className="focus:shadow-outline focus:outline-none text-white hover:underline" onClick={handleMudarSenha} type="button">
                Alterar Senha!
              </button>
            </div>
            <div className="">
              <button className="bg-gray-100 hover:bg-gray-200 focus:shadow-outline focus:outline-none text-green-600 font-bold py-1 px-4 rounded" type="submit">
                Atualizar
              </button>
            </div>
          </div>
        )}
      </form>
      <div>
        {/* {validado ? (
          <p>Email validado!</p>
        ) : (
          <button onClick={handleValidarEmail}>Clique para validar seu email!</button>
        )} */}
        {/* <div>
          <input type="email" value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} placeholder="Novo Email" />
          <button onClick={handleMudarEmail}>Alterar Email</button>
        </div>
        <div>
          <button onClick={handleMudarSenha}>Alterar Senha</button>


        </div> */}
      </div>
    </div>
  );
}

export default ProfileUser;
