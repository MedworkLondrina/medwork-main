import React, { useEffect, useState } from "react";
import { getAuth, sendPasswordResetEmail, updateEmail, sendEmailVerification, verifyBeforeUpdateEmail, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { IoClose, IoLogOut } from "react-icons/io5";
import { connect } from "../../../services/api";
import useAuth from "../../../hooks/useAuth";
import { FaUserGear } from "react-icons/fa6";


function ProfileProfile({ user }) {
  const auth = getAuth();
  const usuario = auth.currentUser;
  const [novoEmail, setNovoEmail] = useState("");
  const validado = usuario.emailVerified;

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
        toast.success("Email enviado com sucesso!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("Erro ao enviar o email: " + errorMessage);
      });
  };

  const handleEditUser = () => {
    toast.info("Larga de ser curioso!");
  };

  return (
    <div className="bg-sky-600 rounded-md px-4 py-2">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-bold text-lg">Informações do Perfil</h2>
        <div className="text-white px-1 py-1 rounded hover:bg-sky-700 cursor-pointer" onClick={handleEditUser}>
          <FaUserGear />
        </div>
      </div>
      <p className="text-white text-sm -mt-1">Usuário: <span className="text-base font-medium">{user.nome_usuario}</span></p>
      <p className="text-white text-sm -mt-1">Email: <span className="text-base font-medium">fellipetereska@gmail.com</span></p>
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

export default ProfileProfile;
