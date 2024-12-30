export class KWh extends React.Component
{
	constructor(props) {
		super(props);
	}

	formatEnergy(f) {
		if(f===undefined || f==='' || isNaN(f))
			return '';

		f = parseFloat(f);

		let unit = 'Wh';
		let digits = 0;
		if(f>=1000)
		{
			f = f / 1000;
			unit = 'kWh';
			digits = 1;
		}

		return f.toFixed(digits) + '\xa0' + unit;
	}

	render() {
		return (
			<span>{this.formatEnergy(this.props.value)}</span>
		);
	}
}
