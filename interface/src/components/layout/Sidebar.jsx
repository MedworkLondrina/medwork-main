import React, { useState, useEffect } from "react";

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


function Sidebar() {

  const companyId = true;

  // Menu
  const [shwoMenu, setShowMenu] = useState(false);

  // Submenu
  const [showCorporativoSubMenu, setShowCorporativoSubMenu] = useState(false);
  const [showRiscosSubMenu, setShowRiscosSubMenu] = useState(false);
  const [showSistemaSubMenu, setShowSistemaSubMenu] = useState(false);
  const [showLaudosSubMenu, setShowLaudosSubMenu] = useState(false);

  // UserSidebar
  const [showUserSidebar, setShowUserSidebar] = useState(false);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          {/* Navbar */}
          <div className="grid grid-cols-3 items-center px-2">

            {/* Logo */}
            <div className="flex items-center justify-start">
              <div className="flex items-center gap-2">
                <div className="cursor-pointer" onClick={() => setShowMenu(!shwoMenu)}>
                  <img src={logo} className="h-8" alt="Medwork Logo" />
                </div>
              </div>
            </div>

            {/* Inquilino */}
            <div className="rounded py-1 px-2 hover:bg-gray-200">
              <h1 className="text-sky-700 text-xl font-bold whitespace-nowrap">Medwork</h1>
            </div>

            <div className="flex items-center">
              {/* Empresa */}
              <div className='flex items-center gap-2 cursor-pointer'>
                <div className='flex items-center gap-2'>
                  <p className='font- text-sm text-zinc-600 hidden md:block'>Empresa:</p>
                  <div
                    className='bg-zinc-50 rounded-md py-2 px-3 hover:bg-zinc-100 truncate max-w-[150px]'>

                    <p className='text-sky-700 font-bold text-base'>Nome</p>
                  </div>
                </div>
                <button>
                  <IoClose />
                </button>
              </div>

              {/* Usuário */}
              <div className="flex items-center ms-3">
                <div className='flex items-center gap-2'>
                  <p className='font- text-sm text-zinc-600 hidden md:block'>Usuário:</p>
                  <div className='bg-zinc-50 rounded-md py-2 px-3 hover:bg-zinc-100 hidden sm:block'>
                    <p className='text-sky-700 font-bold text-base hidden sm:block'>Nome</p>
                  </div>
                  <button className='hidden md:block'>
                    <img src={icon_logout} alt="icon_logout" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {shwoMenu && (
        <aside id="logo-sidebar" className="fixed top-16 mt-1 left-1 z-40 w-64 transition-transform -translate-x-full bg-white shadow-md border border-gray-200 sm:translate-x-0 rounded-md" aria-label="Sidebar">
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

    </>
  );
}

export default Sidebar;