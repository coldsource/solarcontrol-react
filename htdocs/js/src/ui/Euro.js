export class Euro extends React.Component
{
	constructor(props) {
		super(props);
	}

	formatPrice(f) {
		if(f===undefined || f==='' || isNaN(f))
			return '';

		f = parseFloat(f);

		let unit = '€';
		let digits = 2;

		return f.toFixed(digits) + '\xa0' + unit;
	}

	render() {
		return (
			<span>{this.formatPrice(this.props.value)}</span>
		);
	}
}
