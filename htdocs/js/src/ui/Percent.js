export class Percent extends React.Component
{
	constructor(props) {
		super(props);
	}

	formatPercent(d1, d2) {
		if(d1===undefined)
			d1 = 0;

		if(d2===undefined)
			d2 = 0;

		d1 = parseFloat(d1);
		d2 = parseFloat(d2);

		if(d1+d2==0)
			return '';

		let pct = d1/(d1 + d2)*100;
		return parseInt(pct) + ' %';
	}

	render() {
		return (
			<span>{this.formatPercent(this.props.v1, this.props.v2)}</span>
		);
	}
}
