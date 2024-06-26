import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';

import { FiMenu } from "react-icons/fi";
import { BiLogIn } from 'react-icons/bi'
import logo from '../media/logo_menu.png'
import { IoClose } from "react-icons/io5";
import { toast } from 'react-toastify';
import ProfileCompany from '../pages/ProfileCompany'
import { getAuth, signOut } from 'firebase/auth';

function Navbar() {

  //Instanciando as variaveis
  const { user,
    loadSelectedCompanyFromLocalStorage, selectedCompany, companyId,
    handleClearLocalStorageCompany,
    checkSignIn,
    clearUser,
    getUsuarios, usuarios,
    fetchEmpresas, empresas,
    getContatos, contatos,
    getUnidades, unidades,
  } = useAuth();

  const [showModalProfileCompany, setShowModalProfileCompany] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [companyCnpj, setCompanyCnpj] = useState('');
  const [contato, setContato] = useState('');
  const [contactMail, setContactMail] = useState('');
  const [contatoUnidade, setContatoUnidade] = useState('');

  const navigate = useNavigate();

  const empresa = selectedCompany ? selectedCompany.nome_empresa : '';
  const usuario = user ? user.nome_usuario : '';
  const auth = getAuth();
  const usuarioFirebase = auth.currentUser;
  //Criando as Funções

  useEffect(() => {
    const usuario = user ? user.nome_usuario : '';

  },[user])
  const handleLogoutClick = async () => {
    try {
      await signOut(usuarioFirebase)
      clearUser();
      navigate("/login")
      setIsMenuOpen(false)
    } catch (error) {
      console.log("Erro ao deslogar!", error)
    }
  }

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  const clearLocalSotrageCompany = () => {
    handleClearLocalStorageCompany();
    navigate("/home");
    window.location.reload();
  }

  useEffect(() => {
    loadSelectedCompanyFromLocalStorage();
    checkSignIn();
  }, [companyId]);

  const handleSetProfile = () => {
    if (companyId) {
      fetchEmpresas();
      getUnidades();
      getUsuarios();
      getContatos();
    }

    try {
      console.log(empresas)
      const companyInfo = empresas.find((i) => i.id_empresa === companyId);

      if (companyInfo) {
        setCompanyName(companyInfo.nome_empresa);
        setRazaoSocial(companyInfo.razao_social);
        setCompanyCnpj(companyInfo.cnpj_empresa);

        const filteredContatos = contatos.find((i) => i.id_contato === companyInfo.fk_contato_id);

        if (filteredContatos) {
          setContato(filteredContatos.nome_contato);
          setContactMail(filteredContatos.email_contato);
        } else {
          console.error('Nenhum contato encontrado para a empresa: ', companyName);
        }

        const contatosUnidades = {};

        unidades.forEach((unidade) => {
          const filteredContatoUnidade = contatos.find((contato) => contato.id_contato === unidade.fk_contato_id);
          if (filteredContatoUnidade) {
            contatosUnidades[unidade.id_unidade] = filteredContatoUnidade.nome_contato;
          } else {
            console.error('Nenhum contato encontrado para a unidade: ', unidade.nome_unidade);
          }
        });

        setContatoUnidade(contatosUnidades);

      } else {
        console.error("Erro ao buscar os dados da empresa do id: ", companyId)
      }
    } catch (error) {
      console.log("Erro ao buscar dados do profile!", error)
    }
  };

  const handleCompanyInfo = () => {
    handleSetProfile();
    openModalProfileCompany(true);
  };

  const openModalProfileCompany = () => setShowModalProfileCompany(true);
  const closeModalProfileCompany = () => setShowModalProfileCompany(false);

  const location = useLocation();

	const isHomePage = location.pathname === '/sidebar';

	if (isHomePage) {
		return null;
	}

  return (
    <>
      <nav className="bg-white border-gray-200 shadow-md">
        <div className="flex flex-wrap items-center justify-between mx-auto p-4 px-10">
          <div className='flex gap-8 items-center'>
            <Link to="/home"><img className="h-10 flex justify-start" src={logo} alt="" /></Link>
          </div>
          <div className="flex xl:order-1">
            <div className={`gap-4 flex ${'hidden md:flex 2xl:hidden'}`}>
              {/* Informa o Usuario Selecionado */}
              {user ? (
                <div className='flex items-center gap-2'>
                  <p className='font- text-sm text-zinc-600 hidden md:block'>Usuário:</p>
                  <div className='bg-zinc-50 rounded-md py-2 px-3 hover:bg-zinc-100 hidden sm:block'>
                    <p className='text-sky-700 font-bold text-base hidden sm:block'>{usuario}</p>
                  </div>
                  <button className='hidden md:block' onClick={handleLogoutClick}>
                    <IoClose />
                  </button>
                </div>
              ) : null}

              {/* Informa a empresa selecioanda */}
              {selectedCompany && empresa ? (
                <div className='flex items-center gap-2 cursor-pointer'>
                  <div className='flex items-center gap-2' onClick={handleCompanyInfo}>
                    <p className='font- text-sm text-zinc-600 hidden md:block'>Empresa:</p>
                    <div
                      className='bg-zinc-50 rounded-md py-2 px-3 hover:bg-zinc-100 truncate max-w-[150px]'>

                      <p className='text-sky-700 font-bold text-base'>{empresa}</p>
                    </div>
                  </div>
                  <button onClick={clearLocalSotrageCompany}>
                    <IoClose />
                  </button>
                </div>
              ) : null}
            </div>

            {/* Modal Profile Company */}
            <ProfileCompany
              isOpen={showModalProfileCompany}
              onCancel={closeModalProfileCompany}
              companyName={companyName}
              companyCnpj={companyCnpj}
              razaoSocial={razaoSocial}
              contato={contato}
              contactMail={contactMail}
              contatoUnidade={contatoUnidade}
            />

            <div
              type="button"
              onClick={handleMenuClick}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-5xl text-sky-800 rounded-lg 2xl:hidden focus:outline-none focus:ring-2 focus:ring-gray-20">
              <span className="sr-only">Abrir Menu</span>
              <FiMenu />
            </div>
          </div>
          <div className={`items-center justify-between py-2 w-full 2xl:flex 2xl:w-auto 2xl:order-1 ${isMenuOpen ? '' : 'hidden'}`}>
            <ul className={`flex flex-col justify-center font-semibold p-4 gap-2 border-gray-100 rounded-2xl bg-gray-50 2xl:p-0 2xl:space-x-8 rtl:space-x-reverse 2xl:flex-row 2xl:mt-0 2xl:border-0 2xl:bg-white ${isMenuOpen ? '' : 'items-center'}`}>
              <div className={`gap-4 sm:flex md:hidden 2xl:flex`}>
                {/* Informa o Usuario Selecionado */}
                {user ? (
                  <div className='flex items-center gap-2'>
                    <p className={`font- text-sm text-zinc-600 hidden md:block`}>Usuário:</p>
                    <div className={`bg-zinc-50 rounded-md py-2 px-3 hover:bg-zinc-100 hidden sm:block`}>
                      <p className={`text-sky-700 font-bold text-base hidden sm:block`}>{usuario}</p>
                    </div>
                    <button className={`hidden md:block`} onClick={handleLogoutClick}>
                      <IoClose />
                    </button>
                  </div>
                ) : null}

                {/* Informa a empresa selecionada */}
                {selectedCompany && empresa ? (
                  <div className='flex items-center gap-2 cursor-pointer'>
                    <div className='flex items-center gap-2' onClick={handleCompanyInfo}>
                      <p className={`font- text-sm text-zinc-600 hidden md:block`}>Empresa:</p>
                      <div
                        className='bg-zinc-50 rounded-md py-2 px-3 hover:bg-zinc-100 truncate max-w-[200px]'>
                        <p className='text-sky-700 font-bold text-base'>{empresa}</p>
                      </div>
                    </div>
                    <button onClick={clearLocalSotrageCompany}>
                      <IoClose />
                    </button>
                  </div>
                ) : null}
              </div>
              <div className={`border-b border-gray-300 mt-2 mb-2 md:hidden 2xl:block ${isMenuOpen ? 'hidden' : ''}`}></div>

              <li onClick={handleMenuItemClick}
                className="block py-2 px-3 text-zinc-700 md:bg-transparent md:text-zinc-700 md:p-0 hover:rounded-md hover:text-sky-800"><Link to="/home">Home</Link></li>
              <li onClick={handleMenuItemClick}
                className="block py-2 px-3 text-zinc-700 md:bg-transparent md:text-zinc-700 md:p-0 hover:rounded-md hover:text-sky-800"><Link to="/cadastros">Cadastros</Link></li>
              <li onClick={handleMenuItemClick}
                className="block py-2 px-3 text-zinc-700 md:bg-transparent md:text-zinc-700 md:p-0 hover:rounded-md hover:text-sky-800"><Link to="/gestao">Gestão</Link></li>
              <li onClick={handleMenuItemClick}
                className="block py-2 px-3 text-zinc-700 md:bg-transparent md:text-zinc-700 md:p-0 hover:rounded-md hover:text-sky-800"><Link to="/inventario">Inventario de Risco</Link></li>
              <li onClick={handleMenuItemClick}
                className="block py-2 px-3 text-zinc-700 md:bg-transparent md:text-zinc-700 md:p-0 hover:rounded-md hover:text-sky-800"><Link to="/plano">Plano de Ação</Link></li>
              <li onClick={handleMenuItemClick}
                className="block py-2 px-3 text-zinc-700 md:bg-transparent md:text-zinc-700 md:p-0 hover:rounded-md hover:text-sky-800"><Link to="/laudos">Laudos</Link></li>

              <div className='border-b border-gray-300 mt-2 mb-2'></div>
              {/* Renderiza o icon logout quando o usuario loga */}
              {user ? (
                <div className='hover:cursor-pointer py-2 rounded-md'>
                  <BiLogIn
                    className='text-gray-700 scale-150'
                    onClick={handleLogoutClick}
                  />
                </div>
              ) : (
                // Renderiza o botão login quando o usuario da logout
                <Link to="/login">
                  <button
                    className=" bg-sky-600 hover:bg-skky-700 text-white font-bold py-2 px-4 border shadow hover:shadow-md rounded"
                  >
                    Login
                  </button>
                </Link>
              )}
            </ul>
          </div>
        </div>

      </nav>
    </>
  )
}

export default Navbar;