import icon_unidade from '../../../../media/menu/icon_unidade.svg'

function BotaoUnidade() {
	return (
		<div>
			<div className='flex justify-center'>
				<div className="max-w-xs w-52 max-h-32 bg-gray-100 rounded-lg shadow">
					<div className="flex flex-col items-center p-4 pb-6">
						<img className='h-12' src={icon_unidade} />
						<h5 className="text-xl font-medium text-gray-600">Unidade</h5>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BotaoUnidade;