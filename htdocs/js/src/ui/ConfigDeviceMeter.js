import {SelectInteger} from './SelectInteger.js';
import {SelectLetter} from './SelectLetter.js';

export class ConfigDeviceMeter extends React.Component
{
	constructor(props) {
		super(props);

		this.change = this.change.bind(this);
	}

	change(ev) {
		let config = Object.assign({}, this.props.value);

		const name = ev.target.name;
		let value = ev.target.value;

		config[name] = value;

		this.props.onChange({target: {name: this.props.name, value: config}});
	}

	render() {
		let value = this.props.value;
		return (
			<React.Fragment>
				<dt>Meter MQTT ID</dt>
				<dd><input type="text" name="mqtt_id" value={value.mqtt_id} onChange={this.change} /></dd>
				<dt>Meter Phase</dt>
				<dd><SelectLetter from="a" to="c" name="phase" value={value.phase} onChange={this.change} /></dd>
			</React.Fragment>
		);
	}
}
