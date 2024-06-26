import icon_processos from '../../../../media/icon_processos.svg'

function BotaoProcessos() {
	return (
		<div>
			<div className='flex justify-center'>
				<div className="max-w-xs w-52 max-h-32 bg-gray-100 rounded-lg shadow">
					<div className="flex flex-col items-center p-4 pb-6">
						<img src={icon_processos} />
						<h5 className="text-xl font-medium text-gray-600">Processos</h5>
					</div>
				</div>
			</div>
		</div>
	);
}

export default BotaoProcessos;
