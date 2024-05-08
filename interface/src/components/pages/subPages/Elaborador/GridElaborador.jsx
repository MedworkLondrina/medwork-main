import React, { useState, useEffect } from "react";
import { BsFillPencilFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { connect } from '../../../../services/api'; //Conexão com o banco de dados
function GridElaborador({ data, setOnEdit, setData}) {

  const handleEditClick = (empresa) => () => {
    handleEdit(empresa);
  };

  const handleEdit = (empresa) => {
    setOnEdit(empresa);
  };
  
  const handleDesactivation = async (id, ativo) => {
    try {
      // Atualiza o status do item no backend
      const response = await fetch(`${connect}/elaboradores/activate/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ativo: ativo? 0 : 1 }), // Corrigido para desativar se ativo for verdadeiro
      });
  
      if (!response.ok) {
        throw new Error('Erro ao atualizar status da unidade.');
      }
  
      // Atualiza o estado local do item
      const novoElaborador = data.map(item =>
        item.id_elaborador === id? {...item, ativo:!ativo } : item
      );
      setData(data => novoElaborador); 
  
      toast.info(`Unidade ${ativo? 'ativada' : 'inativada'} com sucesso`);
    } catch (error) {
      console.error('Erro ao atualizar status da elaboradores:', error);
      toast.error('Erro ao atualizar status da unidade, verifique o console!');
    }
  };
  
  return (
    <>
      <div className="relative overflow-x-auto sm:rounded-lg flex sm:justify-center">
        <table className="w-full xl:w-5/6 shadow-md text-sm m-8 text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-center">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Telefone
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Cargo
              </th>
              <th scope="col" className="px-6 py-3">
                Registro
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {data.map((item, i) => (
              <tr
                key={i}
                className={`border-b bg-white items-center ${!item.ativo ? 'opacity-25' : ''}`}
              >
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.id_elaborador}
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-left">
                  {item.nome_elaborador}
                </th>
                <td className="px-6 py-4">
                  {item.telefone_elaborador}
                </td>
                <td className="px-6 py-4 text-left">
                  {item.email_elaborador}
                </td>
                <td className="px-6 py-4">
                  {item.cargo_elaborador}
                </td>
                <td className="px-6 py-4">
                  {item.registro_elaborador}
                </td>
                <td className="py-4 gap-4 flex justify-center items-center">
                 <a className={`font-medium text-blue-400 hover:text-blue-800 ${item.ativo ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                  <BsFillPencilFill onClick={() => item.ativo ? handleEditClick(item) : toast.info("Unidade desativada, para editar é necessário ativar a unidade antes!")} />
                </a>
                <label
                  className="relative flex items-center justify-center rounded-full cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={!item.ativo}
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-amber-500 checked:bg-amber-500 checked:before:bg-amber-500 hover:before:opacity-10"
                    onChange={() => handleDesactivation(item.id_elaborador, item.ativo)}
                  />
                  <div className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </label>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default GridElaborador;