import {SelectLetter} from '../../ui/SelectLetter.js';
import {SelectIcon} from '../../ui/SelectIcon.js';
import {Tooltip} from '../../ui/Tooltip.js';

export class Meter extends React.Component
{
	constructor(props) {
		super(props);

		this.types = [
			{icon: 'scf-plug', name: 'Plug S', value: 'plug'},
			{icon: 'scf-meter', name: 'Pro EM', value: 'em'},
			{icon: 'scf-meter', name: 'Pro 3EM', value: '3em'},
			{icon: 'scf-chip', name: 'Arduino', value: 'arduino'}
		];

		this.change = this.change.bind(this);
	}

	change(ev) {
		let config = Object.assign({}, this.props.value);

		const name = ev.target.name;
		let value = ev.target.value;

		config[name] = value;

		this.props.onChange({target: {name: this.props.name, value: config}});
	}

	renderPhase() {
		const value = this.props.value;

		let last_letter = '';
		if(value.type=='3em')
			last_letter = 'c';
		else if(value.type=='em')
			last_letter = 'b';

		if(last_letter=='')
			return;

		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Phase plugged on the Shelly device">
						Meter Phase
					</Tooltip>
				</dt>
				<dd><SelectLetter from="a" to={last_letter} name="phase" value={value.phase} onChange={this.change} /></dd>
			</React.Fragment>
		);
	}

	render() {
		let value = this.props.value;
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Type of Shelly device used to monitor your device">
						Device meter type
					</Tooltip>
				</dt>
				<dd>
					<SelectIcon name="type" values={this.types} value={this.props.value.type} onChange={this.change} />
				</dd>
				<dt>
					<Tooltip content="MQTT ID configured on the Shelly device. This is mandatory to get power consumption. Will be configured automatically if you use auto detection wizard.">
						Meter MQTT ID
					</Tooltip>
				</dt>
				<dd><input type="text" name="mqtt_id" value={value.mqtt_id} onChange={this.change} /></dd>
				{this.renderPhase()}
			</React.Fragment>
		);
	}
}
