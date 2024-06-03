//Importando ferramentas
import { BsFillPencilFill } from 'react-icons/bs';

function GridExames({ exames, setOnEdit }) {

  const findTipo = (admissional, periodico, retorno, mudanca, demissional) => {
    const tipos = [];

    if (admissional === 1) tipos.push('Admissional');
    if (periodico === 1) tipos.push('Periódico');
    if (retorno === 1) tipos.push('Retorno ao Trabalho');
    if (mudanca === 1) tipos.push('Mudança de Risco');
    if (demissional === 1) tipos.push('Demissional');

    return tipos.join(', ');
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg flex sm:justify-center">
      <table className="w-full xl:w-5/6 shadow-md text-sm m-8 text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-center">
              ID
            </th>
            <th scope="col" className="px-4 py-3">
              Exame
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Periodicidade
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Tipo
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {exames && exames.map((item, i) => (
            <tr
              key={i}
              className={`border-b bg-white`}
            >
              <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                {item.id_exame}
              </th>
              <th className="px-4 py-4 text-gray-900 font-medium">
                {item.nome_exame}
              </th>
              <td className="px-4 py-4 text-center">
                {item.periodicidade_exame}
              </td>
              <td className="px-4 py-4 text-center">
                {findTipo(item.admissional, item.periodico, item.retorno, item.mudanca, item.demissional)}
              </td>
              <td className="py-4 gap-4">
                <a className="flex justify-center font-medium text-blue-400 hover:text-blue-800 cursor-pointer">
                  <BsFillPencilFill onClick={() => setOnEdit(item)} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GridExames;
