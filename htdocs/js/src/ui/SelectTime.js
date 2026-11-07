export class SelectTime extends React.Component
{
	constructor(props) {
		super(props);

		this.changeHours = this.changeHours.bind(this);
		this.changeMinutes = this.changeMinutes.bind(this);

		this.ref = React.createRef();
		this.ref_hours = React.createRef();
		this.ref_minutes = React.createRef();
	}

	changeHours(ev) {
		let v = this.props.value.split(':');
		let hours = ev.target.value;
		let minutes = v[1];

		if(hours.match(/^[0-9]{0,2}$/)===null)
			return;

		if(hours>23)
			return;

		if(hours.length==2)
		{
			this.ref_minutes.current.focus();
			minutes = '';
		}

		this.change(hours + ':' + minutes);
	}

	changeMinutes(ev) {
		let v = this.props.value.split(':');
		let hours = v[0];
		let minutes = ev.target.value;

		if(minutes.match(/^[0-9]{0,2}$/)===null)
			return;

		if(minutes>59)
			return;

		this.change(hours + ':' + minutes);
	}

	change(val) {
		this.props.onChange({target: {name: this.props.name, value: val + ':00'}});
	}

	render() {
		let v = this.props.value.split(':');
		let hours = v[0];
		let minutes = v[1];

		return (
			<div className="sc-select-time">
				<input ref={this.ref} type="time" style={{display: 'none'}} value={this.props.value} onChange={this.props.onChange} />
				<input ref={this.ref_hours} inputMode="numeric" type="text" name="hours" value={hours} onChange={this.changeHours} onFocus={() => this.change(':' + minutes)} />
				&#160;:&#160;
				<input ref={this.ref_minutes} inputMode="numeric" type="text" name="minutes" value={minutes} onChange={this.changeMinutes} onFocus={() => this.change(hours + ':')} />
				<i className="scf scf-clock" onClick={ () => this.ref.current.showPicker() } />
			</div>
		);
	}
}
