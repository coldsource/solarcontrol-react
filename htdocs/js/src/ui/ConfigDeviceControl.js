import {SelectInteger} from './SelectInteger.js';
import {Tooltip} from './Tooltip.js';

export class ConfigDeviceControl extends React.Component
{
	constructor(props) {
		super(props);

		this.types = {
			'plug': {icon: 'scf-plug', name: 'Plug S'},
			'pro': {icon: 'scf-plugs', name: 'Pro'}
		};

		this.change = this.change.bind(this);
	}

	change(ev) {
		let config = Object.assign({}, this.props.value);

		const name = ev.target.name;
		let value = ev.target.value;

		if(name=='outlet')
			value = parseInt(value);

		config[name] = value;

		if(name=='type')
		{
			if(value=='plug')
				delete config.outlet;

			if(value=='pro')
				config.outlet = 0;
		}

		if(name=='mqtt_id' && value=='')
			delete config.mqtt_id;

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

	renderOutlet() {
		const value = this.props.value;
		if(value.type!='pro')
			return;

		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Outlet number on the Shelly device">
						Outlet number
					</Tooltip>
				</dt>
				<dd><SelectInteger min={1} max={3} sum={-1} name="outlet" value={value.outlet} onChange={this.change} /></dd>
			</React.Fragment>
		);
	}

	renderMQTTID() {
		const value = this.props.value;
		let mqtt_id = value.mqtt_id!==undefined?value.mqtt_id:'';

		return (
			<React.Fragment>
				<dt>
					<Tooltip content="MQTT ID configured on the Shelly device. This is mandatory to get power consumption. Will be configured automatically if you use auto detection wizard.">
						MQTT ID
					</Tooltip>
				</dt>
				<dd><input type="text" name="mqtt_id" value={mqtt_id} onChange={this.change} /></dd>
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
					<Tooltip content="IP address of the Shelly device (can be found in Shelly app or Autodetected). Will be configured automatically if you use auto detection wizard.">
						IP address
					</Tooltip>
				</dt>
				<dd><input type="text" name="ip" value={value.ip} onChange={this.change} /></dd>
				{this.renderOutlet()}
				{this.renderMQTTID()}
			</React.Fragment>
		);
	}
}
