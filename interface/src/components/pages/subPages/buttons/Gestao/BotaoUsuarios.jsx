import { AiOutlineUserAdd } from 'react-icons/ai'
import icon_add_user from '../../../../media/menu/icon_usuario.svg'

function BotaoUsuario () {
    return(
        <div>
            <div className='flex justify-center'>
                <div className="max-w-xs w-52 max-h-32 bg-gray-100 rounded-lg shadow">
                    <div className="flex flex-col items-center p-4 pb-6">
                        <img className='h-14' src={icon_add_user} />
                        <h5 className="text-xl font-medium dark:text-gray-600">Cadastrar Usuario</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BotaoUsuario;