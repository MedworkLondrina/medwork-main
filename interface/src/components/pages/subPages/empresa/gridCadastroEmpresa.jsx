//Importando ferramentas
import { BsFillPencilFill } from 'react-icons/bs'; //Icone de Edição
import { toast } from 'react-toastify';
import { connect } from '../../../../services/api'; //Conexão com o banco de dados
import { useState } from 'react';
import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";

function GridCadastroEmpresa({ empresa, setEmpresa, setOnEdit, fetchEmpresas, setCompanyId }) {

  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(empresa.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, empresa.length);
  const visibleItems = empresa.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleEditClick = (empresa) => () => {
    handleEdit(empresa);
    setCompanyId(empresa.id_empresa);
  };

  //Função para editar Item
  const handleEdit = (empresa) => {
    setOnEdit(empresa);
  };

  const handleDesactivation = async (id, ativo) => {
    try {
      const response = await fetch(`${connect}/empresas/activate/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ativo: ativo === 1 ? 0 : 1 }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status da empresa.');
      }

      const novaEmpresa = empresa.map(item =>
        item.id_empresa === id ? { ...item, ativo: !ativo } : item
      );
      setEmpresa(novaEmpresa);
      fetchEmpresas();
      toast.info(`Empresa ${!ativo ? 'ativado' : 'inativado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar status da empresa:', error);
      toast.error('Erro ao atualizar status da empresa, verifique o console!');
    }
  };

  return (
    <>
      <div className='flex justify-center w-full mt-6 mb-2'>
        <div className='flex justify-end w-5/6'>
          <div className='flex justify-end items-center gap-1 py-2 rounded px-2'>
            <button className='hover:bg-gray-100 cursor-pointer rounded-md p-1' onClick={handlePrevPage} disabled={page === 0}><IoMdArrowDropleft /></button>
            {/* <span>Página {page + 1} de {totalPages}</span> */}
            <div className={`flex justify-center items-center gap-1`}>
              {Array.from(Array(totalPages).keys()).map((pageNumber) => (
                <div key={pageNumber} className={`hover:bg-gray-100 cursor-pointer rounded px-1 ${page === pageNumber ? 'bg-gray-100' : ''}`} onClick={() => setPage(pageNumber)}>
                  {pageNumber + 1}
                </div>
              ))}
            </div>
            <button className='hover:bg-gray-100 cursor-pointer rounded-md p-1' onClick={handleNextPage} disabled={page === totalPages - 1}><IoMdArrowDropright /></button>
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto sm:rounded-lg flex sm:justify-center">
        <table className="w-full xl:w-5/6 shadow-md text-sm mx-8 text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3">
                ID
              </th>
              <th scope="col" className="px-4 py-3">
                Empresa
              </th>
              <th scope="col" className="px-4 py-3">
                Razão Social
              </th>
              <th scope="col" className="px-4 py-3">
                CNPJ
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                CNAE
              </th>
              <th scope="col" className="px-4 py-3 text-center truncate">
                Grau de Risco
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((item, i) => (
              <tr
                key={i}
                className={`border-b bg-white items-center ${!item.ativo ? 'opacity-25' : ''}`}
              >
                <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.id_empresa}
                </th>
                <th scope="row" className="px-4 py-4 font-medium text-gray-900">
                  {item.nome_empresa}
                </th>
                <td className="px-4 py-4">
                  {item.razao_social}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {item.cnpj_empresa}
                </td>
                <td className="px-4 py-4 text-center whitespace-nowrap">
                  {item.cnae_empresa}
                </td>
                <td className="px-4 py-4 text-center">
                  {item.grau_risco_cnae}
                </td>
                <td className="px-4 py-4">
                  <div className='flex justify-center gap-2 items-center'>
                    <a className="font-medium text-blue-400 hover:text-blue-800 cursor-pointer">
                      <BsFillPencilFill onClick={handleEditClick(item)} />
                    </a>
                    <label className="relative flex items-center rounded-full cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!item.ativo}
                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-amber-500 checked:bg-amber-500 checked:before:bg-amber-500 hover:before:opacity-10"
                        onChange={() => handleDesactivation(item.id_empresa, item.ativo)}
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default GridCadastroEmpresa;
