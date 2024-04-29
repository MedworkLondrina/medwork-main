import { toast } from 'react-toastify';
import useAuth from '../../../hooks/useAuth';


function GridEmpresas({ empresas, onSelect }) {

  const { handleSelectedCompany } = useAuth();

  const handleOpenCompany = async (id, nome_empresa) => {
    try {
      await handleSelectedCompany(id, nome_empresa);
      onSelect(id, nome_empresa);
    } catch (error) {
      toast.warn("Erro ao selecionar empresa!")
      console.log("Erro ao selecionar empresa!", error)
    }
  };

  return (
    <div className="relative overflow-x-auto rounded-xl flex sm:justify-center">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Empresa
            </th>
            <th scope="col" className="px-6 py-3">
              Razão Social
            </th>
            <th scope="col" className="px-6 py-3">
              CNPJ
            </th>
          </tr>
        </thead>
        <tbody>
          {empresas && empresas.filter((i) => i.ativo)
            .map((item, i) => (
              <tr
                key={i}
                className={`border-b bg-white cursor-pointer hover:bg-gray-50 ${item.ativo ? '' : 'opacity-25'}`}
                onClick={() => item.ativo && handleOpenCompany(item.id_empresa, item.nome_empresa)}
              >
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.id_empresa}
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.nome_empresa}
                </th>
                <td className="px-6 py-4">
                  {item.razao_social}
                </td>
                <td className="px-6 py-4">
                  {item.cnpj_empresa}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default GridEmpresas;
