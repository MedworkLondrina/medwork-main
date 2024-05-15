import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail, updateEmail, sendEmailVerification, verifyBeforeUpdateEmail, signOut} from "firebase/auth";
import { toast } from "react-toastify";
import { IoClose, IoLogOut } from "react-icons/io5";
import { connect } from "../../../services/api";

function ProfileProfile({ user }) {
    const auth = getAuth();
    const usuario = auth.currentUser;
    const [novoEmail, setNovoEmail] = useState("");
    const validado = usuario.emailVerified;

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

    return (
        <div style={{ width: "100%", backgroundColor: "#007bff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <h2 style={{ color: "#fff", fontWeight: "bold", marginBottom: "20px" }}>Informações do Perfil</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div class={"flex justify-between"}>
            <p style={{ color: "#fff", marginBottom: "10px" }}>Nome do usuário: {user.nome_usuario}</p>
                    </div>
                {validado ? (
                    <p style={{ color: "#90ee90", fontWeight: "bold" }}>Email validado!</p>
                ) : (
                    <button style={{ backgroundColor: "#f0f0f0", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer", color: "#333", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} onClick={handleValidarEmail}>Clique para validar seu email!</button>
                )}
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <input style={{ flexGrow: 1, border: "1px solid #ccc", borderRadius: "5px", padding: "10px" }} type="email" value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} placeholder="Novo Email" />
                    <button style={{ backgroundColor: "#ffc107", color: "white", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} onClick={handleMudarEmail}>Alterar Email</button>
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} onClick={handleMudarSenha}>Alterar Senha</button>
                    

                </div>
            </div>
        </div>
    );
}

export default ProfileProfile;
