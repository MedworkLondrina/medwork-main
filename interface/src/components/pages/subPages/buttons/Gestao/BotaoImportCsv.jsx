import icon_importcsv from '../../../../media/menu/icon_import.svg'

function BotaoImportCsv () {
    return(
        <div>
            <div className='flex justify-center'>
                <div className="max-w-xs w-52 max-h-32 rounded-lg shadow bg-gray-100">
                    <div className="flex flex-col items-center p-4 pb-6">
                        <img className='h-14' src={icon_importcsv} />
                        <h5 className="text-xl font-medium dark:text-gray-600">Importar Dados</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BotaoImportCsv;