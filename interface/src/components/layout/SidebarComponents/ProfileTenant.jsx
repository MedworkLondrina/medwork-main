import React, { useEffect, useState } from "react";
import { connect } from "../../../services/api";
import { toast } from "react-toastify";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function ProfileTenant({ tenant }) {
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [logoChange, setLogoChange] = useState(false);

  const storage = getStorage();
  const storageRef = ref(storage, `logos/${tenant[0].tenant_code}.png`);

  useEffect(() => {
    const fetchImageURL = async () => {
      const downloadURL = await getDownloadURL(storageRef);
      setImageURL(downloadURL);
    };

    fetchImageURL();
  }, [tenant]);


  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const blob = new Blob([file], { type: file.type });
      setImageFile(blob);
    } else {
      console.error('Arquivo não encontrado. Por favor, selecione um arquivo.');
    }
  };

  const updateTenant = async (e) => {
    e.preventDefault();
    setLogoChange(false);
    try {
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on('state_changed',
        (snapshot) => {
          console.log(`Upload is ${snapshot.bytesTransferred} out of ${snapshot.totalBytes}`);
        },
        (error) => {
          console.error(error);
          toast.warn("Erro ao atualizar logo!");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setImageURL(downloadURL);
            toast.success("Logo atualizada com sucesso!");
          });
        }
      );
    } catch (error) {
      console.error("Erro ao atualizar o tenant:", error);
    }
  };

  return (
    <>
      <div className="w-full bg-sky-600 shadow-md px-4 py-4 rounded-xl">
        <div className="px-4 grid grid-cols-3">
          <div className="col-span-2">
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
        </div>
        <div className="px-4 mt-3">
          <form onSubmit={updateTenant}>
            {imageURL ? (
              <>
                <div className="bg-gray-100 py-3 px-6 rounded shadow inline-block max-h-[30vh] max-w[50vh]" onClick={() => setLogoChange(!logoChange)}>
                  <img src={imageURL} className="max-h-[20vh] max-w-[50vh]" alt="Profile" />
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-100 py-3 px-6 rounded shadow inline-block max-h-[30vh] max-w[50vh]" onClick={() => setLogoChange(!logoChange)}>
                  <p className="text-red-700 font-semibold text-sm">Nenhuma Logo Selecionada!</p>
                </div>
              </>
            )}
            {logoChange && (
              <>
                <div className="flex gap-2 mt-1">
                  <input
                    class="relative rounded border border-solid border-secondary-500 bg-gray-50 px-3 py-1 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-transparent file:px-3  file:py-[0.32rem] file:text-surface/50 focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <button type="submit" className="bg-gray-100 hover:bg-gray-200 font-bold text-sky-600 py-1 px-3 rounded">Enviar</button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default ProfileTenant;
