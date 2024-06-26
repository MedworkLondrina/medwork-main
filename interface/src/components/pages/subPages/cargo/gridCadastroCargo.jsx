import { BsFillPencilFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { connect } from '../../../../services/api';
import { useEffect, useState } from 'react';

function GridCadastroCargo({ cargos, setCargo, getCargo, setOnEdit, find, findUnidades }) {

  const handleEdit = (item) => {
    setOnEdit(item);
  };

  const handleDesactivation = async (id, ativo) => {
    try {
      const response = await fetch(`${connect}/cargos/activate/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ativo: ativo === 1 ? 0 : 1 }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status do cargo.');
      }

      const novoCargo = cargos.map(item =>
        item.id_cargo === id ? { ...item, ativo: !ativo } : item
      );
      setCargo(novoCargo);
      getCargo();
      toast.info(`Cargo ${!ativo ? 'ativado' : 'inativado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar status do cargo:', error);
      toast.error('Erro ao atualizar status do cargo, verifique o console!');
    }
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg flex sm:justify-center">
      <table className="w-full xl:w-5/6 shadow-md text-sm m-8 text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3">
              ID
            </th>
            <th scope="col" className="px-4 py-3">
              Cargo
            </th>
            <th scope="col" className="px-4 py-3">
              Descrição
            </th>
            <th scope="col" className="text-center px-4 py-3">
              Qntd Funcionários(as)
            </th>
            <th scope="col" className="px-4 py-3">
              Setor
            </th>
            <th scope="col" className="px-4 py-3">
              Unidade
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {cargos
            .map((item, i) => (
              <tr key={i} className={`border-b bg-white ${!item.ativo ? 'opacity-25' : ''}`}>
                <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.id_cargo}
                </th>
                <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.nome_cargo}
                </th>
                <td className="px-4 py-4">
                  {item.descricao}
                </td>
                <td className="text-center px-4 py-4">
                  <p>
                    <span className='font-medium text-gray-900'>Masc:</span> {item.func_masc}
                  </p>
                  <p>
                    <span className='font-medium text-gray-900'>Fem:</span> {item.func_fem}
                  </p>
                  <p>
                    <span className='font-medium text-gray-900'>Menor:</span> {item.func_menor}
                  </p>
                </td>
                <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {find(item.fk_setor_id)}
                </th>
                <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {findUnidades(item.fk_setor_id)}
                </th>
                <td className="px-5 py-4">
                  <div className='flex justify-center items-center gap-4'>
                    <a className={`font-medium text-blue-400 hover:text-blue-800 ${item.ativo ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                      <BsFillPencilFill onClick={() => item.ativo && handleEdit(item)} />
                    </a>
                    <label
                      className="relative flex items-center justify-center rounded-full cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={!item.ativo}
                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-amber-500 checked:bg-amber-500 checked:before:bg-amber-500 hover:before:opacity-10"
                        onChange={() => handleDesactivation(item.id_cargo, item.ativo)}
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
  );
}

export default GridCadastroCargo;
