import {SelectLetter} from './SelectLetter.js';
import {Tooltip} from './Tooltip.js';

export class ConfigDeviceMeter extends React.Component
{
	constructor(props) {
		super(props);

		this.types = {
			'plug': {icon: 'scf-plug', name: 'Plug S'},
			'3em': {icon: 'scf-meter', name: 'Pro 3EM'}
		};

		this.change = this.change.bind(this);
	}

	change(ev) {
		let config = Object.assign({}, this.props.value);

		const name = ev.target.name;
		let value = ev.target.value;

		config[name] = value;

		this.props.onChange({target: {name: this.props.name, value: config}});
	}

	renderTiles() {
		return Object.keys(this.types).map(type => {
			let icon = this.types[type].icon;
			let name = this.types[type].name;
			return (
				<i
					key={type}
					className={"scf " + icon + ((this.props.value.type==type)?' selected':'')}
					onClick={() => this.change({target: {name: "type", value: type}})}
				><span>{name}</span></i>
			);
		});
	}

	renderPhase() {
		const value = this.props.value;

		if(value.type!='3em')
			return;

		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Phase plugged on the Shelly device">
						Meter Phase
					</Tooltip>
				</dt>
				<dd><SelectLetter from="a" to="c" name="phase" value={value.phase} onChange={this.change} /></dd>
			</React.Fragment>
		);
	}

	render() {
		let value = this.props.value;
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Type of Shelly device used to switch on or off your device">
						Device controller type
					</Tooltip>
				</dt>
				<dd>
					<div className="sc-select-controltype">
						{this.renderTiles()}
					</div>
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
