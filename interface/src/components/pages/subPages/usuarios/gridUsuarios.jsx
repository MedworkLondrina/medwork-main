import { BsFillPencilFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { connect, auth } from '../../../../services/api';
import { MdOutlineLockReset } from "react-icons/md";
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';

function GridUsuarios({ usuario, setOnEdit, setFilteredUsuarios }) {

  const actionCodeSettings = {
    url: 'https://medwork-dev.vercel.app/login',
  };
  const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(
    auth
  );

  const handleEdit = (user) => {
    setOnEdit(user);
  };

  const filterTipo = (item) => {
    try {
      switch (item) {
        case 0:
          return "Sem Permissão";
        case 1:
          return "Administrador";
        case 2:
          return "Técnico"
        default:
          return "N/A"
      }
    } catch (error) {
      toast.warn("Erro ao filtrar Permissões do Usuário")
      console.log("Erro ao filtrar tipo", error)
    }
  }
  const handleDesactivation = async (id, ativo) => {
    try {
      const response = await fetch(`${connect}/usuarios/activate/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ativo: ativo ? 0 : 1 }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status da unidade.');
      }

      const novoUsuario = usuario.map(item =>
        item.id_usuario === id ? { ...item, ativo: !ativo } : item
      );
      setFilteredUsuarios(novoUsuario);

      toast.info(`Usuário ${ativo ? 'ativado' : 'inativado'} com sucesso`);
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error);
      toast.error('Erro ao atualizar status do usuário!');
    }
  };

  const handleRecoverPassword = async (email) => {
    try {
      const success = await sendPasswordResetEmail(email, actionCodeSettings);
      if (success) {
        toast.success(`E-mail de recuperação de senha enviado para ${email}`);
      } else {
        console.log(error.message)
        toast.error('Erro ao enviar o e-mail de recuperação de senha.');
      }
    } catch (error) {
      toast.error(`Erro ao enviar o e-mail de recuperação de senha: ${error.message}`);
    }
  };


  return (
    <div className="flex justify-center mb-20">
      <table className="w-5/6 shadow-md text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-center">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Nome
            </th>
            <th scope="col" className="px-6 py-3">
              CPF
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Permissão
            </th>
            <th scope="col" className="flex justify-center px-6 py-3">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {usuario && usuario.sort((a, b) => b.id_usuario - a.id_usuario)
            .map((item, i) => (
              <tr key={i} className={`bg-white border-b ${!item.ativo ? 'opacity-25' : ''}`}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                  {item.id_usuario}
                </th>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap truncate">
                  {item.nome_usuario}
                </th>
                <td className="px-6 py-4">
                  {item.cpf_usuario}
                </td>
                <td className="px-6 py-4 truncate">
                  {item.email}
                </td>
                <td className="px-6 py-4 text-center">
                  {filterTipo(item.tipo)}
                </td>

                <td className="py-4 gap-2 flex justify-center items-center">
                  {/* Editar */}
                  <div className={`font-medium text-blue-400 hover:text-blue-800 ${item.ativo ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                    <BsFillPencilFill onClick={() => item.ativo ? handleEdit(item) : toast.info("Unidade desativada, para editar é necessário ativar a unidade antes!")} />
                  </div>
                  {/* Inativar */}
                  <label
                    className="relative flex items-center justify-center rounded-full cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={!item.ativo}
                      className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-amber-500 checked:bg-amber-500 checked:before:bg-amber-500 hover:before:opacity-10"
                      onChange={() => handleDesactivation(item.id_usuario, item.ativo)}
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

                  {/* Recuperar Senha */}
                  <div className={`text-teal-500 hover:text-teal-700 text-lg ${item.ativo ? 'cursor-pointer' : 'cursor-not-allowed'}`} onClick={() => handleRecoverPassword(item.email)}>
                    <MdOutlineLockReset />
                  </div>

                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default GridUsuarios;
