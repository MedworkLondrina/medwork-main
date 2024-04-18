import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuth from '../../hooks/useAuth';

// Components
import ProfileTenant from './SidebarComponents/ProfileTenant';
import ProfileCompany from "./SidebarComponents/ProfileCompany";
import GridEmpresas from "./SidebarComponents/GridEmpresas";

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
import icon_contato from '../media/menu/icon_contato.svg';
import icon_corporativo from '../media/menu/icon_corporativo.svg';
// Controle de Riscos
import icon_controle_risco from '../media/menu/icon_controle_risco.svg';
import icon_processos from '../media/menu/icon_processo.svg';
import icon_riscos from '../media/menu/icon_risco.svg';
import icon_medidas from '../media/menu/icon_medidas.svg';
import icon_vinculos from '../media/menu/icon_vinculos.svg';
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

// UserSideBar
import icon_logout from '../media/menu/icon_logout.svg';
import icon_change from '../media/menu/icon_change.svg';


function Sidebar() {

  const {
    loadSelectedCompanyFromLocalStorage,
    checkSignIn,
    handleClearLocalStorageCompany,
    getTenant,
    fetchEmpresas,
    getContatos, contatos,
  } = useAuth(null);

  const [company, setCompany] = useState([]);
  const [companyId, setCompanyId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [user, setUser] = useState([]);
  const [tenant, setTenant] = useState([]);
  const [tenantName, setTenantName] = useState('');
  const [empresas, setEmpresas] = useState([]);

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

  const getCompany = async () => {
    const selectCompany = await loadSelectedCompanyFromLocalStorage();
    setCompany(selectCompany);
    if (selectCompany) {
      setCompanyId(selectCompany.id_empresa);
      setCompanyName(selectCompany.nome_empresa);
    } else {
      setCompanyId('');
      setCompanyName('');
    }
  }
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

  useEffect(() => {
    getContatos();
    getCompany();
    get();
  }, []);

  const clearLocalSotrageCompany = () => {
    setCompany(null);
    setCompanyId('');
    setCompanyName('');
    setShowProfileCompany(false);
    handleClearLocalStorageCompany();
  };

  const menuOpen = () => {
    setShowProfileCompany(false);
    setShowProfileTenant(false);
    setShowSearchCompany(false);
    setShowMenu(!showMenu);
  };

  const companyOpen = async () => {
    setShowMenu(false);
    setShowProfileTenant(false);
    setShowSearchCompany(false);
    setShowProfileCompany(!showProfileCompany);
  };

  const tenantOpen = () => {
    setShowMenu(false);
    setShowProfileCompany(false);
    setShowSearchCompany(false);
    setShowProfileTenant(!showProfileTenant);
  };

  const openSearchCompany = () => {
    setShowProfileCompany(false);
    setShowProfileTenant(false);
    setShowMenu(false);
    setShowSearchCompany(!showSearchCompany);
  };

  // Search
  useEffect(() => {
    const filtered = empresas.filter((emp) => emp.nome_empresa.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredEmpresas(filtered);
  }, [searchTerm, empresas]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    openSearchCompany();
  };

  const onSelect = (idCompany, nameCompany) => {
    setShowProfileCompany(false);
    setCompanyId(idCompany);
    setCompanyName(nameCompany);
    setSearchTerm('');
    getCompany();
  }

  return (
    <>
      <nav className="fixed top-0 z-40 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3 shadow">
          {/* Navbar */}
          <div className="grid grid-cols-3 items-center px-2">

            {/* Column 1 */}
            <div className="flex items-center justify-start">
              <div className="flex items-center gap-2">
                {/* Logo */}
                <div className="cursor-pointer" onClick={menuOpen}>
                  <img src={logo} className="h-10" alt="logo_system" />
                </div>

                {/* Inquilino */}
                <div className={`rounded py-1 px-2 w-5/6 cursor-pointer ${showProfileTenant ? 'bg-gray-100 hover:bg-gray-100' : 'hover:bg-gray-100 hover:shadow-sm'}`} onClick={tenantOpen}>
                  <h1 className="text-center text-sky-700 font-bold truncate cursor-pointer">{tenantName}</h1>
                </div>

              </div>
            </div>

            {/* Column 2 */}
            <div className="w-full">
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
            <div className="flex items-center justify-end">
              {/* Usuário */}
              <div className='space-y-1 cursor-pointer'>
                <div className="flex items-center gap-2">
                  <div className='bg-zinc-50 rounded-md py-2 px-3 hover:bg-zinc-100 truncate max-w-[200px]'>

                    <p className='text-sky-700 font-bold text-base'>{user ? user.nome_usuario : ''}</p>
                  </div>
                  <button>
                    <img src={icon_logout} alt="icon_logout" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        {showMenu && (
          <aside id="logo-sidebar" className="fixed left-1 mt-1 z-50 w-64 transition-transform -translate-x-full bg-white shadow-md border border-gray-200 sm:translate-x-0 rounded-md" aria-label="Sidebar">
            <div className="h-full overflow-y-auto">
              <ul className="space-y-2 font-medium cursor-pointer px-3 py-2">

                {/* Home */}
                <li className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                  <div>
                    <img src={icon_home} alt="icon_home" />
                  </div>
                  <span className="ms-3">Home</span>
                </li>

                {/* Corporativo */}
                <li className={`${showCorporativoSubMenu ? 'bg-gray-100 rounded-md' : ''}`} onClick={() => setShowCorporativoSubMenu(!showCorporativoSubMenu)}>
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
                            <li className="hover:bg-sky-100">
                              <div className={`flex items-center py-2 px-6`}>
                                <img src={icon_unidade} alt="icon_unidade" />
                                <span className="ms-3 font-normal">Unidade</span>
                              </div>
                            </li>

                            {/* Setor */}
                            <li className="hover:bg-sky-100">
                              <div className={`flex items-center py-2 px-6`}>
                                <img src={icon_setor} alt="icon_setor" />
                                <span className="ms-3 font-normal">Setor</span>
                              </div>
                            </li>

                            {/* Cargo */}
                            <li className="hover:bg-sky-100">
                              <div className={`flex items-center py-2 px-6`}>
                                <img src={icon_cargo} alt="icon_cargo" />
                                <span className="ms-3 font-normal">Cargo</span>
                              </div>
                            </li>

                            {/* Contato */}
                            <li className="hover:bg-sky-100">
                              <div className={`flex items-center py-2 px-6`}>
                                <img src={icon_contato} alt="icon_contato" />
                                <span className="ms-3 font-normal">Contato</span>
                              </div>
                            </li>
                          </>
                        ) : (
                          <>
                            {/* Empresa */}
                            <li className="hover:bg-sky-100">
                              <div className={`flex items-center py-2 px-6`}>
                                <img src={icon_empresa} alt="icon_empresa" />
                                <span className="ms-3 font-normal">Empresa</span>
                              </div>
                            </li>
                          </>
                        )}


                      </ul>
                    </>
                  )}
                </li>

                {/* Controle de Riscos */}
                <li className={`${showRiscosSubMenu ? 'bg-gray-100 rounded-md' : ''}`} onClick={() => setShowRiscosSubMenu(!showRiscosSubMenu)}>
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
                          <li className="hover:bg-sky-100">
                            <div className={`flex items-center py-2 px-6`}>
                              <img src={icon_processos} alt="icon_processo" />
                              <span className="ms-3 font-normal">Processos</span>
                            </div>
                          </li>

                          {/* Riscos */}
                          <li className="hover:bg-sky-100">
                            <div className={`flex items-center py-2 px-6`}>
                              <img src={icon_riscos} alt="icon_riscos" />
                              <span className="ms-3 font-normal">Riscos</span>
                            </div>
                          </li>

                          {/* Medidas */}
                          <li className="hover:bg-sky-100">
                            <div className={`flex items-center py-2 px-6`}>
                              <img src={icon_medidas} alt="icon_cargo" />
                              <span className="ms-3 font-normal">Medidas</span>
                            </div>
                          </li>

                          {/* Vinculos */}
                          <li className="hover:bg-sky-100">
                            <div className={`flex items-center py-2 px-6`}>
                              <img src={icon_vinculos} alt="icon_contato" />
                              <span className="ms-3 font-normal">Vínculos</span>
                            </div>
                          </li>
                        </>


                      </ul>
                    </>
                  )}
                </li>

                {/* Gestão do Sistema */}
                <li className={`${showSistemaSubMenu ? 'bg-gray-100 rounded-md' : ''}`} onClick={() => setShowSistemaSubMenu(!showSistemaSubMenu)}>
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
                        <li className="hover:bg-sky-100">
                          <div className={`flex items-center py-2 px-6`}>
                            <img src={icon_usuario} alt="icon_usuario" />
                            <span className="ms-3 font-normal">Usuários</span>
                          </div>
                        </li>

                        {/* Elaboradores */}
                        <li className="hover:bg-sky-100">
                          <div className={`flex items-center py-2 px-6`}>
                            <img src={icon_carteira} alt="icon_carteira" />
                            <span className="ms-3 font-normal">Elaboradores</span>
                          </div>
                        </li>

                        {/* Aparelhos */}
                        <li className="hover:bg-sky-100">
                          <div className={`flex items-center py-2 px-6`}>
                            <img src={icon_aparelho} alt="icon_aparelho" />
                            <span className="ms-3 font-normal">Aparelhos</span>
                          </div>
                        </li>

                        {/* Importar Dados */}
                        <li className="hover:bg-sky-100">
                          <div className={`flex items-center py-2 px-6`}>
                            <img src={icon_import} alt="icon_import" />
                            <span className="ms-3 font-normal">Importar Dados</span>
                          </div>
                        </li>
                      </ul>
                    </>
                  )}
                </li>

                {/* Inventário de Riscos */}
                <li className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                  <div>
                    <img src={icon_inventario} alt="icon_inventario" />
                  </div>
                  <span className="ms-3">Inventário de Riscos</span>
                </li>

                {/* Plano de Ação */}
                <li className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                  <div>
                    <img src={icon_plano} alt="icon_plano" />
                  </div>
                  <span className="ms-3">Plano de Ação</span>
                </li>

                {/* Laudos */}
                <li className={`${showLaudosSubMenu ? 'bg-gray-100 rounded-md' : ''}`} onClick={() => setShowLaudosSubMenu(!showLaudosSubMenu)}>
                  <div className={`flex items-center hover:bg-gray-100 p-2 ${showLaudosSubMenu ? 'hover:bg-sky-100 bg-sky-200 rounded-t-md' : 'rounded-md'}`}>
                    <img src={icon_laudos} alt="icon_laudos" />
                    <span className="ms-3">Laudos</span>
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
                      <ul className="space-y-2 font-medium cursor-pointer">
                        {/* PGR */}
                        <li className="hover:bg-sky-100">
                          <div className={`flex items-center py-2 px-6`}>
                            <img src={icon_laudo} alt="icon_pgr" />
                            <div>
                              <span className="ms-3 font-normal">PGR</span>
                            </div>
                          </div>
                        </li>

                        {/* LTCAT */}
                        <li className="hover:bg-sky-100">
                          <div className={`flex items-center py-2 px-6`}>
                            <img src={icon_laudo} alt="icon_ltcat" />
                            <span className="ms-3 font-normal">LTCAT</span>
                          </div>
                        </li>

                        {/* LIP */}
                        <li className="hover:bg-sky-100">
                          <div className={`flex items-center py-2 px-6`}>
                            <img src={icon_laudo} alt="icon_lip" />
                            <span className="ms-3 font-normal">LIP</span>
                          </div>
                        </li>

                        {/* PCMSO */}
                        <li className="hover:bg-sky-100">
                          <div className={`flex items-center py-2 px-6`}>
                            <img src={icon_laudo} alt="icon_pcmso" />
                            <span className="ms-3 font-normal">PCMSO</span>
                          </div>
                        </li>
                      </ul>
                    </>
                  )}
                </li>

              </ul>
            </div>
          </aside>
        )}

        {/* Profile Tenant */}
        {(showProfileTenant && tenant) && (
          <>
            <aside id="profileTenant" className="fixed left-2 mt-1 z-40 w-7/12 transition-transform -translate-x-full bg-white shadow-md border border-gray-200 sm:translate-x-0 rounded-xl" aria-label="profileTenant">
              <ProfileTenant
                tenant={tenant}
              />
            </aside>
          </>
        )}

        {/* Profile Company */}
        {(searchTerm || showProfileCompany) && (
          <>
            <aside id="companyContainer" className="fixed left-0 right-0 mx-auto mt-1 z-40 w-10/12 bg-white shadow-md border border-gray-200 rounded-xl" aria-label="companyContainer">
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

      </nav>
    </>
  );
}

export default Sidebar;