import { AiOutlineUserAdd } from 'react-icons/ai'
import icon_add_elaborador from '../../../../media/menu/icon_carteira.svg'

function BotaoElaborador () {
    return(
        <div>
            <div className='flex justify-center'>
                <div className="max-w-xs w-52 max-h-32 bg-gray-100 rounded-lg shadow">
                    <div className="flex flex-col items-center p-4 pb-6">
                        <img className='h-14' src={icon_add_elaborador} />
                        <h5 className="text-lg font-medium dark:text-gray-600">Cadastrar Elaborador</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BotaoElaborador;