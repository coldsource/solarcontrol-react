export class Temperature extends React.Component
{
	constructor(props) {
		super(props);
	}

	formatTemp(f) {
		if(f===undefined || f==='' || isNaN(f))
			return '';

		f = parseFloat(f);

		return f.toFixed(1) + '\xa0' + '°C';
	}

	render() {
		return (
			<span>{this.formatTemp(this.props.value)}</span>
		);
	}
}
