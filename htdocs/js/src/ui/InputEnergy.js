export class InputEnergy extends React.Component
{
	constructor(props) {
		super(props);

		this.change = this.change.bind(this);
	}

	check(str) {
		str = '' + str;

		let ret = str.match(/^[0-9]+(\.[0-9]+)?/);
		if(ret===null)
			return false;

		let val = ret[0];
		let unit = str.substr(val.length).toLowerCase();
		if(!['', 'wh', 'kwh'].includes(unit))
			return false;

		return true;
	}

	change(ev) {
		this.props.onChange(ev);
	}

	render() {
		let style = {};
		if(!this.check(this.props.value))
			style = {color: 'red'};

		return (
			<input type="text" className="energy" name={this.props.name} value={this.props.value} onChange={this.change} style={style} />
		);
	}
}
