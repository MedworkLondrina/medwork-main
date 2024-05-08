import { useState } from 'react';
import { BsFillPencilFill } from 'react-icons/bs';
import { FiLink } from "react-icons/fi";
import ModalProcessoRisco from '../components/Modal/ModalProcessoRisco';
import { toast } from 'react-toastify';

function GridProcesso({ processos, setOnEdit }) {

  const [showModal, setShowModal] = useState(null);
  const [processName, setProcessName] = useState(null);
  const [processId, setProcessId] = useState(null);

  const handleEdit = (item) => {
    setOnEdit(item);
  };

  //Funções do Modal
  //Função para abrir o Modal
  const openModal = () => setShowModal(true);
  //Função para fechar o Modal
  const closeModal = () => setShowModal(false);

  const handleProcessSelect = (item) => {
    setProcessName(item.nome_processo)
    setProcessId(item.id_processo)
    openModal();
  }

  return (
    <>
      <div className="relative flex justify-center mt-4 -mb-8 px-1">
        <div className='w-5/6 flex justify-end'>
          <p className='text-sm'>Legenda - <span className='font-medium'>L:</span> Local <span className='font-medium'>G:</span> Global </p>
        </div>
      </div>
      <div className="relative overflow-x-auto sm:rounded-lg flex sm:justify-center">
        <table className="w-full xl:w-5/6 shadow-md text-sm m-8 text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-center w-1/12">
                ID
              </th>
              <th scope="col" className="px-4 py-3 text-center w-1/12">
                Tipo
              </th>
              <th scope="col" className="px-4 py-3 w-9/12">
                Processo
              </th>
              <th scope="col" className="px-4 py-3 text-center w-1/12">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {processos.sort((a, b) => {
              if (a.tenant_code !== null && b.tenant_code !== null) {
                return a.tenant_code - b.tenant_code;
              }
              if (a.tenant_code !== null) {
                return -1;
              }
              if (b.tenant_code !== null) {
                return 1;
              }
              return a.id_processo - b.id_processo;
            })
              .map((item, i) => (
                <tr key={i} className="border-b bg-white">
                  <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                    {item.id_processo}
                  </th>
                  <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                    {item.tenant_code !== null ? (
                      <p className='text-gray-700 font-bold'>L</p>
                    ) : (
                      <p className='text-gray-500 font-semibold'>G</p>
                    )}
                  </th>
                  <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.nome_processo}
                  </th>
                  <td className="px-5 py-4 gap-4 flex justify-center">
                    {item.tenant_code !== null ? (
                      <a className="font-medium text-blue-400 hover:text-blue-800 cursor-pointer">
                        <BsFillPencilFill onClick={() => handleEdit(item)} />
                      </a>
                    ) : (
                      <a className="font-medium text-gray-300 cursor-not-allowed">
                        <BsFillPencilFill onClick={() => toast.warn("Não é possível fazer alterações em um processo global!")} />
                      </a>
                    )}
                    <a className={`cursor-pointer text-yellow-500 text-lg ${!item.ativo ? 'cursor-not-allowed' : ''}`} onClick={() => handleProcessSelect(item)}>
                      <FiLink />
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <ModalProcessoRisco
        isOpen={showModal}
        onCancel={closeModal}
        childName={processName}
        childId={processId}
        children={processos}
      />
    </>
  );
}

export default GridProcesso;
