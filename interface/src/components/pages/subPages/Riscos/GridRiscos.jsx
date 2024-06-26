import React, { useState } from "react";

import { BsFillPencilFill } from 'react-icons/bs';
import { FiLink } from "react-icons/fi";
import ModalRiscoMedidas from "../components/Modal/ModalRiscoMedidas";
import ModalRiscoExames from "../components/Modal/ModalRiscoExames";
import { FaFileMedical } from "react-icons/fa";

function GridRiscos({ riscos, setOnEdit, exames }) {

  const [showModal, setShowModal] = useState(false);
  const [showModalExames, setShowModalExames] = useState(false);
  const [riscoName, setRiscoName] = useState();
  const [riscoId, setRiscoId] = useState();

  const handleEditClick = (risco) => {
    handleEdit(risco);
  }

  const handleEdit = (item) => {
    setOnEdit(item);
  }

  //Funções do Modal
  //Função para abrir o Modal
  const openModal = () => setShowModal(true);
  const openModalExames = () => setShowModalExames(true);
  //Função para fechar o Modal
  const closeModal = () => setShowModal(false);
  const closeModalExames = () => setShowModalExames(false);

  const handleSetModal = (item) => {
    setRiscoId(item.id_risco)
    setRiscoName(item.nome_risco)
    openModal();
  };

  const handleSetModalExames = (item) => {
    setRiscoId(item.id_risco)
    setRiscoName(item.nome_risco)
    openModalExames();
  };

  const filterSeverity = (item) => {
    try {
      switch (item) {
        case 0:
          return "N/A";
        case 1:
          return "Muito Baixa";
        case 2:
          return "Baixa";
        case 3:
          return "Média";
        case 4:
          return "Alta";
        case 5:
          return "Muito Alta";
        default:
          return "N/A";
      }
    } catch (error) {
      console.error("Erro ao filtrar Severidade", error)
    }
  }

  return (
    <>
      <div className="relative overflow-x-auto sm:rounded-lg flex sm:justify-center">
        <table className="w-full xl:w-5/6 shadow-md text-sm m-8 text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3">
                ID
              </th>
              <th scope="col" className="px-4 py-3">
                Risco
              </th>
              <th scope="col" className="px-4 py-3">
                Grupo
              </th>
              <th scope="col" className="px-4 py-3">
                E-social
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Nivel de Ação
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Limite de Tolerância
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Severidade
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {riscos.map((item, i) => (
              <tr
                key={i}
                className={`border-b bg-white`}
              >
                <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.id_risco}
                </th>
                <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.nome_risco}
                </th>
                <td className="px-4 py-4">
                  {item.grupo_risco}
                </td>
                <td className="px-4 py-4">
                  {item.codigo_esocial_risco}
                </td>
                <td className="px-4 py-4 text-center">
                  {item.nivel_acao_risco} {item.unidade_medida_risco}
                </td>
                <td className="px-4 py-4 text-center">
                  {item.limite_tolerancia_risco} {item.unidade_medida_risco}
                </td>
                <td className="px-4 py-4 text-center">
                  {filterSeverity(item.severidade_risco)}
                </td>
                <td className="py-4 px-2">
                  <div className="gap-4 flex justify-center items-center">
                    <a className="font-medium text-blue-400 hover:text-blue-800 cursor-pointer">
                      <BsFillPencilFill onClick={() => handleEditClick(item)} />
                    </a>
                    <a className={`cursor-pointer text-yellow-500 text-lg`} onClick={() => handleSetModal(item)}>
                      <FiLink />
                    </a>
                    <a className={`cursor-pointer text-green-500 text-lg`} onClick={() => handleSetModalExames(item)}>
                      <FaFileMedical />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ModalRiscoMedidas
        onCancel={closeModal}
        isOpen={showModal}
        childId={riscoId}
        childName={riscoName}
        children={riscos}
      />
      <ModalRiscoExames
        onCancel={closeModalExames}
        isOpen={showModalExames}
        childId={riscoId}
        childName={riscoName}
        children={riscos}
        exames={exames}
      />
    </>
  );
}

export default GridRiscos;