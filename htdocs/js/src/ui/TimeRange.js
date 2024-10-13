export class TimeRange extends React.Component
{
	constructor(props) {
		super(props);
	}

	normalize_time(t) {
		const parts = /^([0-9]+):([0-9]+)/.exec(t);
		return parts[1].padStart(2, '0') + ':' + parts[2].padStart(2, '0');
	}

	change(part, ev) {
		let val = Object.assign({}, this.props.value);
		if(part=='from')
			val.from = ev.target.value;
		else
			val.to = ev.target.value;

		this.props.onChange({target: {name: this.props.name, value: val}});
	}

	render() {
		return (
			<div className="sc-timerange">
				<input type="time" step="60" value={this.normalize_time(this.props.value.from)} onChange={ ev => this.change('from', ev) } />
				<input type="time" step="60" value={this.normalize_time(this.props.value.to)} onChange={ ev => this.change('to', ev) } />
			</div>
		);
	}
}
