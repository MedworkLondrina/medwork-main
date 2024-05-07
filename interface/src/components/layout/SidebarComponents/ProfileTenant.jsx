import React, { useEffect, useState } from "react";
import { connect } from "../../../services/api";

function ProfileTenant({ tenant }) {
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  // Função para carregar a imagem do perfil do banco de dados
  const loadProfileImage = async () => {
    try {
      const imageDataArray = tenant[0].logo_tenant.data; // Obtém o array de bytes da imagem
      const blob = new Blob([new Uint8Array(imageDataArray)], { type: 'image/png' }); // Cria um novo Blob a partir dos bytes
      const url = URL.createObjectURL(blob); // Cria a URL de objeto para o Blob
      setImageURL(url); // Define a URL de objeto como a URL da imagem
    } catch (error) {
      console.error("Erro ao carregar a imagem do perfil:", error);
    }
  };
  
  
  // Chamando a função para carregar a imagem do perfil assim que o componente for montado
  useEffect(() => {
    loadProfileImage();
  }, []); // O array vazio como segundo argumento faz com que o useEffect seja executado apenas uma vez, quando o componente é montado


  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const blob = new Blob([file], { type: file.type });
      setImageFile(blob);
      console.log(blob)
    } else {
      console.error('Arquivo não encontrado. Por favor, selecione um arquivo.');
    }
  };

  const updateTenant = async () => {
    try {
      const formData = new FormData();
      formData.append("tenant_code", tenant[0].tenant_code);
      formData.append("nome_tenant", tenant[0].nome_tenant);
      formData.append("cnpj_tenant", tenant[0].cnpj_tenant);
      formData.append("logo_tenant", imageFile); // Aqui está sua imagem blob
      formData.append("cep_tenant", tenant[0].cep_tenant);
      formData.append("rua_tenant", tenant[0].rua_tenant);
      formData.append("numero_tenant", tenant[0].numero_tenant);
      formData.append("complemento_tenant", tenant[0].complemento_tenant);
      formData.append("bairro_tenant", tenant[0].bairro_tenant);
      formData.append("cidade_tenant", tenant[0].cidade_tenant);
      formData.append("uf_tenant", tenant[0].uf_tenant);
      formData.append("dataCriacao_tenant", tenant[0].dataCriacao_tenant);
      formData.append("status", tenant[0].status);
      formData.append("global", tenant[0].global);

      const response = await fetch(`${connect}/tenant/${tenant[0].id_tenant}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar o tenant. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data); // Verifica a resposta

    } catch (error) {
      console.error("Erro ao atualizar o tenant:", error);
    }
  };

  return (
    <>
      <div className="w-full bg-sky-600 shadow-md px-4 py-4 rounded-xl">
        <div className="px-4 grid grid-cols-3">
          <div className="col-span-2">
            {imageURL && <img src={imageURL}  />}
            <h2 className="text-white font-extrabold text-xl truncate">
              {tenant[0].nome_tenant}
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-white text-sm font-light">Endereço:</p>
              <p className="text-white truncate">
                {tenant[0].rua_tenant}, {tenant[0].numero_tenant} -{" "}
                {tenant[0].bairro_tenant} - {tenant[0].cidade_tenant}/
                {tenant[0].uf_tenant}
              </p>
            </div>
          </div>
          <div className="col-span-1 text-right px-2">
            <h2 className="text-white font-extrabold text-xl truncate">
              {tenant[0].cnpj_tenant}
            </h2>
          </div>
          <form>
            <input type="file" id="imagem" accept="image/*" onChange={handleImageUpload} />
            <button type="button" onClick={updateTenant}>BLOB!</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ProfileTenant;
