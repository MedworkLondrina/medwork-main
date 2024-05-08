import icon_link from '../../../../media/menu/icon_vinculos.svg'

function BotaoVinculos() {
  return (
    <div>
      <div className='flex justify-center'>
        <div className="max-w-xs w-52 max-h-32 bg-gray-100 rounded-lg shadow">
          <div className="flex flex-col items-center p-4 pb-6">
            <img className='h-12' src={icon_link} />
            <h5 className="text-lg font-medium text-gray-600">Vínculos</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BotaoVinculos;
