export class TimeRange extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			display_days: false
		}

		this.changeData = this.changeData.bind(this);
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

	toggleWeekDay(week_day) {
		let val = Object.assign({}, this.props.value);
		let days_of_week = val.days_of_week===undefined?[]:[...val.days_of_week];

		let idx = days_of_week.indexOf(week_day);
		if(idx==-1)
			days_of_week.push(week_day);
		else
			days_of_week.splice(idx, 1);

		val.days_of_week = days_of_week;

		this.props.onChange({target: {name: this.props.name, value: val}});
	}

	toggleOffpeak() {
		let val = Object.assign({}, this.props.value);
		if(val.offpeak===undefined)
			val.offpeak = false;

		val.offpeak = !val.offpeak;
		this.props.onChange({target: {name: this.props.name, value: val}});
	}

	renderWeekDaysDetail() {
		return ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day, idx) => {
			let selected = false;

			if(this.props.value.days_of_week!==undefined && this.props.value.days_of_week.indexOf(idx)!=-1)
				selected = true;

			return (
				<span key={idx} className={selected?"selected":""} onClick={() => this.toggleWeekDay(idx)}>{day}</span>
			);
		});
	}

	renderWeekDays() {
		if(!this.state.display_days)
			return;

		return (
			<div>
				{this.renderWeekDaysDetail()}
				<i className="scf scf-clock" onClick={() => this.setState({display_days: false})} />
			</div>
		);
	}

	renderFromTo() {
		if(this.state.display_days)
			return;

		return (
			<div>
				<input type="time" step="60" value={this.normalize_time(this.props.value.from)} onChange={ ev => this.change('from', ev) } />
				<input type="time" step="60" value={this.normalize_time(this.props.value.to)} onChange={ ev => this.change('to', ev) } />
				<i className="scf scf-calendar" onClick={() => this.setState({display_days: true})} />
				<i className={"scf scf-leaf" + (this.props.value.offpeak?" on":"")} onClick={() => this.toggleOffpeak()} />
			</div>
		);
	}

	changeData(ev) {
		let val = Object.assign({}, this.props.value);
		val.data = {};
		val.data[ev.target.name] = parseFloat(ev.target.value);
		this.props.onChange({target: {name: this.props.name, value: val}});
	}

	renderComplementaryFields() {
		const options = this.props.options;
		if(options===undefined)
			return;

		let field = {};
		if(this.props.options.temperature)
			field = {name: 'temperature', icon: 'scf-thermometer', tooltip: "Target temperature in °C"};
		else if(this.props.options.moisture)
			field = {name: 'moisture', icon: 'scf-droplet', tooltip: "Target moisture percentage"};

		let val = '';
		if(this.props.value.data && this.props.value.data[field.name])
			val = this.props.value.data[field.name];

		return (
			<div className="options">
				<input type="number" value={val} name={field.name} onChange={this.changeData} />
				<i className={"scf " + field.icon} />
				<div className="tooltip">
					{field.tooltip}
				</div>
			</div>
		);
	}

	render() {
		return (
			<div className="sc-timerange">
				{this.renderFromTo()}
				{this.renderWeekDays()}
				{this.renderComplementaryFields()}
			</div>
		);
	}
}
