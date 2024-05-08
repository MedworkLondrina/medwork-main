import { BsFillPencilFill } from 'react-icons/bs';
import { toast } from 'react-toastify';

function GridCadastroEpi({ epis, setOnEdit }) {

  const handleEdit = (item) => {
    setOnEdit(item);
  };


  return (
    <>
      <div className="relative flex justify-center -mb-8 mt-4 px-1">
        <div className='w-5/6 flex justify-end'>
          <p className='text-sm'>Legenda - <span className='font-medium'>L:</span> Local <span className='font-medium'>G:</span> Global </p>
        </div>
      </div>
      <div className="relative overflow-x-auto sm:rounded-lg flex sm:justify-center">
        <table className="w-full xl:w-5/6 shadow-md text-sm m-8 text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-center">
                ID
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Tipo
              </th>
              <th scope="col" className="px-4 py-3 w-9/12">
                Medida de Proteção Individual
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {epis && epis.sort((a, b) => {
              if (a.tenant_code !== null && b.tenant_code !== null) {
                return a.tenant_code - b.tenant_code;
              }
              if (a.tenant_code !== null) {
                return -1;
              }
              if (b.tenant_code !== null) {
                return 1;
              }
              return a.id_medida - b.id_medida;
            })
              .map((item, i) => (
                <tr
                  key={i}
                  className={`border-b bg-white`}
                >
                  <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                    {item.id_medida}
                  </th>
                  <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                    {item.tenant_code !== null ? (
                      <p className='text-gray-700 font-bold'>L</p>
                    ) : (
                      <p className='text-gray-500 font-semibold'>G</p>
                    )}
                  </th>
                  <td className="px-4 py-4">
                    {item.descricao_medida}
                  </td>
                  <td className="py-4 gap-4">
                    <div className="gap-4 flex justify-center items-center">
                      {item.tenant_code !== null ? (
                        <a className="font-medium text-blue-400 hover:text-blue-800 cursor-pointer">
                          <BsFillPencilFill onClick={() => handleEdit(item)} />
                        </a>
                      ) : (
                        <a className="font-medium text-gray-300 cursor-not-allowed">
                          <BsFillPencilFill onClick={() => toast.warn("Não é possível fazer alterações em uma medida global!")} />
                        </a>
                      )}
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

export default GridCadastroEpi;