import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import GridHome from "./subPages/GridHome";
import SearchInput from "./subPages/components/SearchInput";
import { IoInformationCircleSharp } from "react-icons/io5";
import img from '../media/logo_menu.png';


function Home() {

  const { contatos, companyId, handleSetCompanyId, fetchEmpresas, checkSignIn } = useAuth(null);

  //Instanciando o Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);
  const [visible, setVisible] = useState(false);
  const [empresas, setEmpresas] = useState([]);

  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const fetchImageURL = async () => {
      const tenant = await checkSignIn();
      const storage = getStorage();
      const storageRef = ref(storage, `logos/${tenant.tenant_code}.png`);
      const downloadURL = await getDownloadURL(storageRef);
      setImageURL(downloadURL);
    };

    fetchImageURL();
  }, []);


  useEffect(() => {
    handleSetCompanyId();
  }, []);

  const get = async () => {
    const data = await fetchEmpresas();
    setEmpresas(data);
  };

  useEffect(() => {
    get();
  }, [companyId]);

  //Função para Pesquisa
  useEffect(() => {
    const filtered = empresas.filter((emp) => emp.nome_empresa.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredEmpresas(filtered);
  }, [searchTerm, empresas]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      {/* Titulo */}
      <div className="flex justify-center mb-8 mt-4">
        <div className="p-4 max-w-[70vh] max-h-[30vh]">
          <img src={imageURL} />
        </div>
      </div>

    </div>
  )
}

export default Home;