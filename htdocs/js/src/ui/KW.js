export class KW extends React.Component
{
	constructor(props) {
		super(props);
	}

	formatPower(f) {
		if(f===undefined || f==='')
			return '';

		f = parseFloat(f);

		let unit = 'W';
		if(f>=1000)
		{
			f = f / 1000;
			unit = 'kW';
		}

		return f.toFixed(1) + unit;
	}

	render() {
		return (
			<span>{this.formatPower(this.props.value)}</span>
		);
	}
}