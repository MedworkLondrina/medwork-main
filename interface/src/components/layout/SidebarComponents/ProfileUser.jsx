import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail, verifyBeforeUpdateEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { connect } from "../../../services/api";
import useAuth from "../../../hooks/useAuth";
import { IoClose, IoLogOut } from "react-icons/io5";
import { FaUserEdit, FaUserTimes } from "react-icons/fa";


function ProfileUser({ user }) {
  const navigate = useNavigate();
  const { clearUser } = useAuth();
  const auth = getAuth();
  const usuario = auth.currentUser;
  const [novoEmail, setNovoEmail] = useState("");
  const [novoNomeUsuario, setNovoNomeUsuario] = useState("");
  const [edit, setEdit] = useState(false);
  const [emailTrocado, setEmailTrocado] = useState(false);

  useEffect(() => {
    console.log("Nome do usuário alterado:", user.nome_usuario);
  }, [user.nome_usuario]);

  const handleMudarEmail = async (e) => {
    e.preventDefault();
    if (!novoEmail) {
      toast.error("Por favor, insira um novo email.");
      return;
    }
    try {
      await verifyBeforeUpdateEmail(usuario, novoEmail);
      await handleMudarLocal(novoEmail, novoNomeUsuario);
      toast.success("Verifique seu e-mail para atualizar!");
    } catch (error) {
      toast.error("Erro ao enviar o email: " + error.message);
    }
  };

  const handleMudarLocal = async (email, nomeUsuario) => {
    try {
      const tenant_code = user.tenant_code;
      const queryParams = new URLSearchParams({ tenant_code: tenant_code }).toString();
      const url = `${connect}/usuarios_email/${user.id_usuario}/?${queryParams}`;
      const method = "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email || usuario.email,
          nome_usuario: nomeUsuario || user.nome_usuario,
        }),
      });

      if (!response.ok) {
        toast.error("Erro ao Alterar o Email!");
        throw new Error(`Erro ao cadastrar/editar Setor. Status: ${response.status}`);
      }

      const responseData = await response.json();

      const userDefine = {
        id_usuario: user.id_usuario,
        tenant_code: user.tenant_code,
        nome_usuario: nomeUsuario || user.nome_usuario,
        permissao_usuario: user.tipo,
        token_usuario: user.authToken,
      };

      console.log("Atualizando localStorage com:", userDefine);
      localStorage.setItem('user', JSON.stringify(userDefine));

      toast.success("Informações atualizadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar o registro");
    }
  };

  const handleMudarSenha = () => {
    sendPasswordResetEmail(auth, usuario.email)
      .then(() => {
        toast.success("Email para redefinir senha enviado com sucesso!");
      })
      .catch((error) => {
        toast.error("Erro ao enviar o email: " + error.message);
      });
  };

  const handleEditUser = () => {
    setEdit(!edit);
  };

  const handleEmailChange = (e) => {
    setEmailTrocado(true);
    setNovoEmail(e.target.value);
  };

  const handleNameChange = (e) => {
    setNovoNomeUsuario(e.target.value);
  };

  const logout = () => {
    try {
      clearUser();
      navigate("/login");
    } catch (error) {
      console.log("Erro ao deslogar!", error);
    }
  };

  return (
    <div className="bg-sky-600 rounded-md px-4 py-2">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-bold text-lg">Informações do Usuário</h2>
        <div className="flex">
          <div className="text-white px-1 py-1 rounded hover:bg-sky-700 cursor-pointer" onClick={handleEditUser}>
            {edit ? (
              <>
                <FaUserTimes />
              </>
            ) : (
              <>
                <FaUserEdit />
              </>
            )}
          </div>
          <div className="text-white px-1 py-1 rounded hover:bg-sky-700 cursor-pointer" onClick={logout}>
            <IoLogOut />
          </div>
        </div>
      </div>
      <form onSubmit={emailTrocado ? handleMudarEmail : (e) => { e.preventDefault(); handleMudarLocal(novoEmail, novoNomeUsuario); }}>
        {/* Usuario */}
        <div className={`w-full flex items-center gap-1 ${edit ? 'mt-1 mb-2' : ''}`}>
          <label className="w-1/6 text-white text-sm" htmlFor="usuario">
            Usuário:
          </label>
          <input
            className={`${edit ? 'appearance-none block w-5/6 bg-gray-100 rounded py-1 px-2' : 'appearance-none bg-transparent border-transparent text-white text-base font-bold'}`}
            id="usuario"
            type="text"
            name="nome_usuario"
            value={novoNomeUsuario || user.nome_usuario}
            onChange={handleNameChange}
            disabled={!edit}
          />
        </div>
        {/* Email */}
        <div className={`w-full flex items-center gap-1 ${edit ? 'mt-1 mb-2' : '-mt-1'}`}>
          <label className="w-1/6 text-white text-sm" htmlFor="usuario">
            E-mail:
          </label>
          <input
            className={`${edit ? 'appearance-none block w-5/6 bg-gray-100 rounded py-1 px-2' : 'appearance-none bg-transparent border-transparent text-white text-base font-bold'}`}
            id="usuario"
            type="text"
            name="email_usuario"
            value={novoEmail || usuario.email}
            onChange={handleEmailChange}
            disabled={!edit}
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
    </div>
  );
}

export default ProfileUser;
