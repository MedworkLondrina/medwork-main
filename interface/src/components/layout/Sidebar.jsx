import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from '../../hooks/useAuth';

// Components
import ProfileTenant from './SidebarComponents/ProfileTenant';
import ProfileCompany from "./SidebarComponents/ProfileCompany";
import ProfileUser from "./SidebarComponents/ProfileUser";
import GridEmpresas from "./SidebarComponents/GridEmpresas";
import ModalRelatorioCnae from "../pages/subPages/components/Modal/GerarRelatorioCnae";

// Images
import logo from '../media/logo_menu.png';

// Icons
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

import icon_home from '../media/menu/icon_home.svg';
// Corporativo
import icon_empresa from '../media/menu/icon_empresa.svg';
import icon_unidade from '../media/menu/icon_unidade.svg';
import icon_setor from '../media/menu/icon_setor.svg';
import icon_cargo from '../media/menu/icon_cargo.svg';
import icon_corporativo from '../media/menu/icon_corporativo.svg';
// Controle de Riscos
import icon_controle_risco from '../media/menu/icon_controle_risco.svg';
import icon_processos from '../media/menu/icon_processo.svg';
import icon_riscos from '../media/menu/icon_risco.svg';
import icon_medidas from '../media/menu/icon_medidas.svg';
import icon_exame from '../media/menu/icon_exame.svg';
// Gestão do Sistema
import icon_gestao from '../media/menu/icon_gestao.svg';
import icon_usuario from '../media/menu/icon_usuario.svg';
import icon_carteira from '../media/menu/icon_carteira.svg';
import icon_aparelho from '../media/menu/icon_aparelho.svg';
import icon_import from '../media/menu/icon_import.svg';
// Icones Menu
import icon_inventario from '../media/menu/icon_inventario.svg';
import icon_plano from '../media/menu/icon_plano.svg';
// Laudos
import icon_laudos from '../media/menu/icon_laudos.svg';
import icon_laudo from '../media/menu/icon_laudo.svg';
import icon_relatorio_cnae from '../media/menu/icon_relatorio_cnae.svg';

// UserSideBar
import icon_logout from '../media/menu/icon_logout.svg';
import icon_change from '../media/menu/icon_change.svg';


function Sidebar() {

  const navigate = useNavigate();

  const {
    loadSelectedCompanyFromLocalStorage,
    checkSignIn,
    handleClearLocalStorageCompany,
    getTenant,
    fetchEmpresas,
    fetchContatos,
    clearUser,
    loginUser,
  } = useAuth(null);

  const [company, setCompany] = useState([]);
  const [companyId, setCompanyId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [user, setUser] = useState([]);
  const [tenant, setTenant] = useState([]);
  const [tenantName, setTenantName] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [contatos, setContatos] = useState([]);
  const [showModalRelatorioCnae, setShowModalRelatorioCnae] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);

  // Menu
  const [showMenu, setShowMenu] = useState(false);

  // Submenu
  const [showCorporativoSubMenu, setShowCorporativoSubMenu] = useState(false);
  const [showRiscosSubMenu, setShowRiscosSubMenu] = useState(false);
  const [showSistemaSubMenu, setShowSistemaSubMenu] = useState(false);
  const [showLaudosSubMenu, setShowLaudosSubMenu] = useState(false);

  // Porfile
  const [showProfileCompany, setShowProfileCompany] = useState(false);
  const [showProfileTenant, setShowProfileTenant] = useState(false);
  const [showSearchCompany, setShowSearchCompany] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [columnThreeClicked, setColumnThreeClicked] = useState(false);

  const getCompany = async () => {
    const selectCompany = await loadSelectedCompanyFromLocalStorage();
    setCompany(selectCompany);
    if (selectCompany) {
      getContact();
      setCompanyId(selectCompany.id_empresa);
      setCompanyName(selectCompany.nome_empresa);
    } else {
      setCompanyId('');
      setCompanyName('');
    }
  };

  const getContact = async () => {
    const resCon = await fetchContatos();
    setContatos(resCon);
  };

  // Second
  useEffect(() => {
    closeMenu();
    get();
  }, [loginUser]);

  // User, Tenant, Empresas
  const get = async () => {
    const userCheck = await checkSignIn();
    setUser(userCheck);
    if (userCheck) {
      const tenantCode = userCheck.tenant_code;
      const tenantCheck = await getTenant(tenantCode);
      setTenant(tenantCheck);
      tenantCheck ? setTenantName(tenantCheck[0].nome_tenant) : setTenantName('');
    }

    const empresasCheck = await fetchEmpresas();
    setEmpresas(empresasCheck);
  };

  // First
  useEffect(() => {
    getCompany();
  }, [companyId, loginUser]);

  const clearLocalSotrageCompany = () => {
    navigate("/");
    setCompany(null);
    setCompanyId('');
    setCompanyName('');
    setShowProfileCompany(false);
    handleClearLocalStorageCompany();
  };

  const menuOpen = () => {
    setShowUserProfile(false);
    setShowProfileCompany(false);
    setShowProfileTenant(false);
    setShowSearchCompany(false);
    setShowMenu(!showMenu);
  };

  const companyOpen = async () => {
    getCompany();
    setShowMenu(false);
    setShowUserProfile(false);
    setShowProfileTenant(false);
    setShowSearchCompany(false);
    setShowProfileCompany(!showProfileCompany);
  };

  const tenantOpen = () => {
    setShowMenu(false);
    setShowProfileCompany(false);
    setShowSearchCompany(false);
    setShowUserProfile(false);
    setShowProfileTenant(!showProfileTenant);
  };

  const openSearchCompany = () => {
    setShowMenu(false);
    setShowUserProfile(false);
    setShowProfileCompany(false);
    setShowProfileTenant(false);
    setShowSearchCompany(true);
  };

  // Search
  useEffect(() => {
    if (user) {
      const filtered = empresas.filter((emp) => emp.nome_empresa.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredEmpresas(filtered);
    }
  }, [searchTerm, empresas]);

  const handleSearch = async (e) => {
    openSearchCompany();
    const empresasCheck = await fetchEmpresas();
    setEmpresas(empresasCheck);
    const term = e.target.value;
    setSearchTerm(term);
  };

  const onSelect = (idCompany, nameCompany) => {
    setShowProfileCompany(false);
    closeMenu();
    setCompanyId(idCompany);
    setCompanyName(nameCompany);
    getCompany();
    getContact();
    navigate('/');
  };

  const closeMenu = () => {
    setShowMenu(false);
    setShowProfileCompany(false);
    setShowProfileTenant(false);
    setSearchTerm('');
    setShowSearchCompany(false);
    setShowUserProfile(false);
    closeSubMenus();
  };

  const closeSubMenus = () => {
    setShowCorporativoSubMenu(false);
    setShowRiscosSubMenu(false);
    setShowLaudosSubMenu(false);
    setShowSistemaSubMenu(false);
  };

  const [uniqueKey, setUniqueKey] = useState('');

  useEffect(() => {
    if (columnThreeClicked) {
      // Atualizar a chave única para forçar a renderização do ProfileUser
      setUniqueKey(Math.random().toString());
    }
  }, [columnThreeClicked]);

  const openCorparitveMenu = () => {
    closeSubMenus();
    setShowCorporativoSubMenu(!showCorporativoSubMenu);
  };

  const openRiscksMenu = () => {
    closeSubMenus();
    setShowRiscosSubMenu(!showRiscosSubMenu);
  };

  const userProfileOpen = () => {
    setShowMenu(false);
    setShowProfileCompany(false);
    setShowProfileTenant(false);
    setShowUserProfile(!showUserProfile);
  }

  const closeModal = () => {
    setColumnThreeClicked(false);
  };

  const openSystemMenu = () => {
    closeSubMenus();
    setShowSistemaSubMenu(!showSistemaSubMenu);
  };


  const openLaudosMenu = () => {
    closeSubMenus();
    setShowLaudosSubMenu(!showLaudosSubMenu);
  };

  const handleSomeAction = () => {
    if (columnThreeClicked) {
      closeModal();
    }
  };

  const logout = () => {
    try {
      clearUser();
      navigate("/login")
      closeMenu();
    } catch (error) {
      console.log("Erro ao deslogar!", error)
    }
  };

  const openModalRelatorioCnae = () => setShowModalRelatorioCnae(true);
  const closeModalRelatorioCnae = () => setShowModalRelatorioCnae(false);

  const location = useLocation();

  if (location.pathname === '/login') {
    return null;
  };

  return (
    <>
      {user ? (
        <div>
          {/* Camada de fundo */}
          <div className={`modal-overlay fixed inset-0 backdrop-blur-[1px] bg-black bg-opacity-5 z-50 ${showMenu || showProfileCompany || showProfileTenant || showSearchCompany || showUserProfile ? 'block' : 'hidden'}`} onClick={closeMenu}></div>
          {/* Barra de navegação */}
          <nav className="fixed top-0 w-full z-50 h-16 bg-white border-b border-gray-200">
            <div className="px-3 py-3 lg:px-5 lg:pl-3 shadow">
              {/* Navbar */}
              <div className="grid grid-cols-12 lg:grid-cols-3 items-center px-2">

                {/* Column 1 */}
                <div className="flex items-center justify-start col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-2">
                    {/* Logo */}
                    <div className="cursor-pointer" onClick={menuOpen}>
                      <img src={logo} className="h-10" alt="logo_system" />
                    </div>
                    {tenantName ? (
                      <div className={`rounded py-1 px-2 w-5/6 cursor-pointer hidden lg:block ${showProfileTenant ? 'bg-gray-100 hover:bg-gray-100' : 'hover:bg-gray-100 hover:shadow-sm'}`} onClick={tenantOpen}>
                        <h1 className="text-center text-sky-700 font-bold truncate cursor-pointer">{tenantName}</h1>
                      </div>
                    ) : null}

                    {/* Inquilino */}

                  </div>
                </div>

                {/* Column 2 */}
                <div className="w-full col-span-10 lg:col-span-1">
                  {companyId ? (
                    <>
                      {/* Empresa Selecionada */}
                      <div className={`space-y-1 cursor-pointer`}>
                        <div className="grid grid-cols-12 items-center gap-2">
                          {/* Company Name */}
                          <div className="col-span-11">
                            <div className='w-full bg-zinc-50 rounded-md py-2 px-3 hover:bg-zinc-100' onClick={companyOpen}>
                              <p className='text-sky-700 font-bold text-base text-center truncate'>{companyName}</p>
                            </div>
                          </div>

                          {/* Change Button */}
                          <div className="col-span-1">
                            <button className={`hover:shadow-md rounded-md p-1`} onClick={clearLocalSotrageCompany}>
                              <img src={icon_change} alt="icon_change" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Search Company
                    <>
                      <div className="w-full">
                        <div className="relative w-full">
                          <input
                            type="text"
                            id="default-search"
                            className="w-full p-2 ps-6 text-sm text-gray-900 rounded-full bg-gray-100 shadow-sm"
                            placeholder="Localizar uma empresa"
                            onChange={handleSearch}
                            onClick={() => setShowSearchCompany(true)}
                            onBlur={handleSearch}
                            required
                          />
                          <button
                            type="submit"
                            className="text-gray-400 absolute end-2.5 bottom-1 focus:ring-4 focus:outline-none hover:text-gray-700 font-medium rounded-lg text-sm p-2">
                            <svg
                              className="h-3 text-gray-500 dark:text-gray-400 hover:text-gray-700"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 20">
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Column 3 */}
                <div className="w-full lg:col-span-1">

                  <div className="relative w-full">
                    <div className="items-center justify-end lg:flex">

                      {/* Usuário */}
                      {user && (
                        <div className="space-y-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <div className="bg-zinc-50 rounded-md py-2 px-3 hover:bg-zinc-100 truncate " onClick={userProfileOpen}>
                              <p className="text-sky-700 font-bold text-base">{user ? user.nome_usuario : ''}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>


              </div>
            </div>

            {/* Menu */}
            {showMenu && (
              <aside id="logo-sidebar" className="fixed right-1 mx-auto left-1 mt-1 z-50 sm:w-64 sm:mx-0 bg-white shadow-md border border-gray-200 rounded-md" aria-label="Sidebar">
                <div className="h-full overflow-y-auto">
                  <ul className="space-y-2 font-medium cursor-pointer px-3 py-2">

                    {/* Home */}
                    <Link to="/home" onClick={closeMenu}>
                      <li className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                        <div>
                          <img src={icon_home} alt="icon_home" />
                        </div>
                        <span className="ms-3">Home</span>
                      </li>
                    </Link>

                    {/* Corporativo */}
                    <li className={`${showCorporativoSubMenu ? 'bg-gray-100 rounded-md' : ''}`} onClick={openCorparitveMenu}>
                      <div className={`flex items-center hover:bg-gray-100 p-2 ${showCorporativoSubMenu ? 'hover:bg-sky-100 bg-sky-200 rounded-t-md' : 'rounded-md'}`}>
                        <img src={icon_corporativo} alt="icon_corporativo" />
                        <span className="ms-3">Corporativo</span>
                        <div className="absolute right-3 flex items-center justify-center pr-2">
                          {showCorporativoSubMenu ? (
                            <>
                              <IoIosArrowUp />
                            </>
                          ) : (
                            <>
                              <IoIosArrowDown />
                            </>
                          )}
                        </div>
                      </div>
                      {showCorporativoSubMenu && (
                        <>
                          <ul className="space-y-2 font-medium cursor-pointer">

                            {/* Empresa */}
                            {companyId ? (
                              <>
                                {/* Unidade */}
                                <Link to="/cadastro_unidade" onClick={() => setShowMenu(!showMenu)}>
                                  <li className="hover:bg-sky-100">
                                    <div className={`flex items-center py-2 px-6`}>
                                      <img src={icon_unidade} alt="icon_unidade" />
                                      <span className="ms-3 font-normal">Unidade</span>
                                    </div>
                                  </li>
                                </Link>

                                {/* Setor */}
                                <Link to="/cadastro_setor" onClick={() => setShowMenu(!showMenu)}>
                                  <li className="hover:bg-sky-100">
                                    <div className={`flex items-center py-2 px-6`}>
                                      <img src={icon_setor} alt="icon_setor" />
                                      <span className="ms-3 font-normal">Setor</span>
                                    </div>
                                  </li>
                                </Link>

                                {/* Cargo */}
                                <Link to="/cadastro_cargo" onClick={() => setShowMenu(!showMenu)}>
                                  <li className="hover:bg-sky-100">
                                    <div className={`flex items-center py-2 px-6`}>
                                      <img src={icon_cargo} alt="icon_cargo" />
                                      <span className="ms-3 font-normal">Cargo</span>
                                    </div>
                                  </li>
                                </Link>
                              </>
                            ) : (
                              <>
                                {/* Empresa */}
                                <Link to="/cadastro_empresa" onClick={() => setShowMenu(!showMenu)}>
                                  <li className="hover:bg-sky-100">
                                    <div className={`flex items-center py-2 px-6`}>
                                      <img src={icon_empresa} alt="icon_empresa" />
                                      <span className="ms-3 font-normal">Empresa</span>
                                    </div>
                                  </li>
                                </Link>
                              </>
                            )}


                          </ul>
                        </>
                      )}
                    </li>

                    {/* Controle de Riscos */}
                    <li className={`${showRiscosSubMenu ? 'bg-gray-100 rounded-md' : ''}`} onClick={openRiscksMenu}>
                      <div className={`flex items-center hover:bg-gray-100 p-2 ${showRiscosSubMenu ? 'hover:bg-sky-100 bg-sky-200 rounded-t-md' : 'rounded-md'}`}>
                        <img src={icon_controle_risco} alt="icon_controle_risco" />
                        <span className="ms-3">Controle de Riscos</span>
                        <div className="absolute right-3 flex items-center justify-center pr-2">
                          {showRiscosSubMenu ? (
                            <>
                              <IoIosArrowUp />
                            </>
                          ) : (
                            <>
                              <IoIosArrowDown />
                            </>
                          )}
                        </div>
                      </div>
                      {showRiscosSubMenu && (
                        <>
                          <ul className="space-y-2 font-medium cursor-pointer">

                            <>
                              {/* Processos */}
                              <Link to="/cadastro_processo" onClick={() => setShowMenu(!showMenu)}>
                                <li className="hover:bg-sky-100">
                                  <div className={`flex items-center py-2 px-6`}>
                                    <img src={icon_processos} alt="icon_processo" />
                                    <span className="ms-3 font-normal">Processos</span>
                                  </div>
                                </li>
                              </Link>

                              {/* Riscos */}
                              <Link to="/cadastro_risco" onClick={() => setShowMenu(!showMenu)}>
                                <li className="hover:bg-sky-100">
                                  <div className={`flex items-center py-2 px-6`}>
                                    <img src={icon_riscos} alt="icon_riscos" />
                                    <span className="ms-3 font-normal">Riscos</span>
                                  </div>
                                </li>
                              </Link>

                              {/* Medidas */}
                              <Link to="/cadastro_medida" onClick={() => setShowMenu(!showMenu)}>
                                <li className="hover:bg-sky-100">
                                  <div className={`flex items-center py-2 px-6`}>
                                    <img src={icon_medidas} alt="icon_cargo" />
                                    <span className="ms-3 font-normal">Medidas</span>
                                  </div>
                                </li>
                              </Link>

                              {/* Exames */}
                              <Link to="/cadastro_exames" onClick={() => setShowMenu(!showMenu)}>
                                <li className="hover:bg-sky-100">
                                  <div className={`flex items-center py-2 px-6`}>
                                    <img src={icon_exame} alt="icon_exame" />
                                    <span className="ms-3 font-normal">Exames</span>
                                  </div>
                                </li>
                              </Link>
                            </>


                          </ul>
                        </>
                      )}
                    </li>

                    {/* Gestão do Sistema */}
                    <li className={`${showSistemaSubMenu ? 'bg-gray-100 rounded-md' : ''}`} onClick={openSystemMenu}>
                      <div className={`flex items-center hover:bg-gray-100 p-2 ${showSistemaSubMenu ? 'hover:bg-sky-100 bg-sky-200 rounded-t-md' : 'rounded-md'}`}>
                        <img src={icon_gestao} alt="icon_gestao" />
                        <span className="ms-3">Gestão do Sistema</span>
                        <div className="absolute right-3 flex items-center justify-center pr-2">
                          {showSistemaSubMenu ? (
                            <>
                              <IoIosArrowUp />
                            </>
                          ) : (
                            <>
                              <IoIosArrowDown />
                            </>
                          )}
                        </div>
                      </div>
                      {showSistemaSubMenu && (
                        <>
                          <ul className="space-y-2 font-medium cursor-pointer">
                            {/* Usuarios */}
                            <Link to="/cadastro_usuario" onClick={() => setShowMenu(!showMenu)}>
                              <li className="hover:bg-sky-100">
                                <div className={`flex items-center py-2 px-6`}>
                                  <img src={icon_usuario} alt="icon_usuario" />
                                  <span className="ms-3 font-normal">Usuários</span>
                                </div>
                              </li>
                            </Link>

                            {/* Elaboradores */}
                            <Link to="/cadastro_elaboradores" onClick={() => setShowMenu(!showMenu)}>
                              <li className="hover:bg-sky-100">
                                <div className={`flex items-center py-2 px-6`}>
                                  <img src={icon_carteira} alt="icon_carteira" />
                                  <span className="ms-3 font-normal">Elaboradores</span>
                                </div>
                              </li>
                            </Link>

                            {/* Aparelhos */}
                            <Link to="/cadastro_aparelhos" onClick={() => setShowMenu(!showMenu)}>
                              <li className="hover:bg-sky-100">
                                <div className={`flex items-center py-2 px-6`}>
                                  <img src={icon_aparelho} alt="icon_aparelho" />
                                  <span className="ms-3 font-normal">Aparelhos</span>
                                </div>
                              </li>
                            </Link>

                            {/* Importar Dados */}
                            <Link to="/importar_dados" onClick={() => setShowMenu(!showMenu)}>
                              <li className="hover:bg-sky-100">
                                <div className={`flex items-center py-2 px-6`}>
                                  <img src={icon_import} alt="icon_import" />
                                  <span className="ms-3 font-normal">Importar Dados</span>
                                </div>
                              </li>
                            </Link>
                          </ul>
                        </>
                      )}
                    </li>


                    {/* Inventário de Riscos, Plano de Ação e Laudos */}
                    {companyId && (
                      <>
                        {/* Inventário de Riscos */}
                        <Link to="/inventario" onClick={closeMenu}>
                          <li className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                            <div>
                              <img src={icon_inventario} alt="icon_inventario" />
                            </div>
                            <span className="ms-3">Inventário de Riscos</span>
                          </li>
                        </Link>

                        {/* Plano de Ação */}
                        <Link to="plano" onClick={closeMenu}>
                          <li className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                            <div>
                              <img src={icon_plano} alt="icon_plano" />
                            </div>
                            <span className="ms-3">Plano de Ação</span>
                          </li>
                        </Link>

                        {/* Laudos */}
                        <li className={`${showLaudosSubMenu ? 'bg-gray-100 rounded-md' : ''}`} onClick={openLaudosMenu}>
                          <div className={`flex items-center hover:bg-gray-100 p-2 ${showLaudosSubMenu ? 'hover:bg-sky-100 bg-sky-200 rounded-t-md' : 'rounded-md'}`}>
                            <img src={icon_laudos} alt="icon_laudos" />
                            <span className="ms-3">Relatórios</span>
                            <div className="absolute right-3 flex items-center justify-center pr-2">
                              {showLaudosSubMenu ? (
                                <>
                                  <IoIosArrowUp />
                                </>
                              ) : (
                                <>
                                  <IoIosArrowDown />
                                </>
                              )}
                            </div>
                          </div>
                          {showLaudosSubMenu && (
                            <>
                              <ul className="font-medium cursor-pointer">
                                {/* PGR */}
                                <Link to="/gerar_pgr" onClick={() => setShowMenu(!showMenu)}>
                                  <li className="hover:bg-sky-100">
                                    <div className={`flex items-center py-2 px-6`}>
                                      <img src={icon_laudo} alt="icon_pgr" />
                                      <div>
                                        <span className="ms-3 font-normal">PGR</span>
                                      </div>
                                    </div>
                                  </li>
                                </Link>

                                {/* LTCAT */}
                                <Link to="/gerar_ltcat" onClick={() => setShowMenu(!showMenu)}>
                                  <li className="hover:bg-sky-100">
                                    <div className={`flex items-center py-2 px-6`}>
                                      <img src={icon_laudo} alt="icon_laudo" />
                                      <span className="ms-3 font-normal">LTCAT</span>
                                    </div>
                                  </li>
                                </Link>

                                {/* LIP */}
                                <Link to="/gerar_lip" onClick={() => setShowMenu(!showMenu)}>
                                  <li className="hover:bg-sky-100">
                                    <div className={`flex items-center py-2 px-6`}>
                                      <img src={icon_laudo} alt="icon_laudo" />
                                      <span className="ms-3 font-normal">LIP</span>
                                    </div>
                                  </li>
                                </Link>

                                {/* PCMSO */}
                                <Link to="/gerar_pcmso" onClick={() => setShowMenu(!showMenu)}>
                                  <li className="hover:bg-sky-100">
                                    <div className={`flex items-center py-2 px-6`}>
                                      <img src={icon_laudo} alt="icon_laudo" />
                                      <span className="ms-3 font-normal">PCMSO</span>
                                    </div>
                                  </li>
                                </Link>

                                {/* DIR */}
                                <Link to="/gerar_dir" onClick={() => setShowMenu(!showMenu)}>
                                  <li className="hover:bg-sky-100">
                                    <div className={`flex items-center py-2 px-6`}>
                                      <img src={icon_laudo} alt="icon_laudo" />
                                      <span className="ms-3 font-normal">DIR</span>
                                    </div>
                                  </li>
                                </Link>

                                {/* Relatório por CNAE */}
                                <li className="hover:bg-sky-100" onClick={() => setShowMenu(!showMenu)}>
                                  <div className={`flex items-center py-2 px-6`} onClick={openModalRelatorioCnae}>
                                    <img src={icon_laudo} alt="icon_laudo" />
                                    <span className="ms-3 font-normal">Relatório por CNAE</span>
                                  </div>
                                </li>
                              </ul>
                            </>
                          )}
                        </li>
                      </>
                    )}

                  </ul>
                </div>
              </aside>
            )}

            {/* Profile Tenant */}
            {(showProfileTenant && tenant) && (
              <>
                <aside id="profileTenant" className="fixed left-2 mt-1 z-40 w-7/12 transition-transform -translate-x-full bg-white shadow-md sm:translate-x-0 rounded-xl" aria-label="profileTenant">
                  <ProfileTenant
                    tenant={tenant}
                  />
                </aside>
              </>
            )}

            {/* Profile Com5-5erpany */}
            {(searchTerm || showProfileCompany) && (
              <>
                <aside id="companyContainer" className="fixed left-0 right-0 overflow-y-auto max-h-[89vh] mx-auto mt-2 z-40 w-10/12 bg-white rounded-xl scrollbar-thin shadow scrollbar-thumb-sky-700 scrollbar-track-transparent" aria-label="companyContainer">
                  {company ? (
                    <ProfileCompany
                      companyId={companyId}
                      empresas={empresas}
                      contatos={contatos}
                    />
                  ) : (
                    <>
                      <GridEmpresas
                        empresas={filteredEmpresas}
                        contatos={contatos}
                        searchTerm={setSearchTerm}
                        setShowProfileCompany={setShowProfileCompany}
                        onSelect={onSelect}
                      />
                    </>
                  )}
                </aside>
              </>
            )}

            {/* User Profile */}
            {showUserProfile && (
              <>
                <aside id="userProfile" className="fixed right-2 mt-1 z-40 w-3/12 transition-transform -translate-x-full bg-white shadow-md sm:translate-x-0 rounded-xl" aria-label="userProfile">
                  <ProfileUser
                    user={user}
                    tenant={tenant}
                    key={uniqueKey}
                    contatos={contatos}
                  />
                </aside>
              </>
            )}

          </nav>
        </div >
      ) : (
        null
      )
      }

      <ModalRelatorioCnae
        isOpen={showModalRelatorioCnae}
        onCancel={closeModalRelatorioCnae}
        companyId={companyId}
        empresas={empresas}
      />

    </>
  );
}

export default Sidebar;