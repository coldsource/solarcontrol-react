import {SelectInteger} from '../../ui/SelectInteger.js';
import {Tooltip} from '../../ui/Tooltip.js';

export class Input extends React.Component
{
	constructor(props) {
		super(props);

		this.types = {
			'dummy': {icon: 'scf-empty', name: 'None'},
			'plus1pm': {icon: 'scf-plug', name: 'Plus 1PM'},
			'pro': {icon: 'scf-plugs', name: 'Pro 3'}
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

	renderOutlet() {
		const value = this.props.value;
		if(value.type!='pro')
			return;

		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Input number on the Shelly device">
						Outlet number
					</Tooltip>
				</dt>
				<dd><SelectInteger min={1} max={3} sum={-1} name="outlet" value={value.outlet} onChange={this.change} /></dd>
			</React.Fragment>
		);
	}

	renderMQTT() {
		const value = this.props.value;
		if(value.type=='dummy')
			return;

		return (
			<React.Fragment>
				<dt>
					<Tooltip content="MQTT ID configured on the Shelly device. Will be configured automatically if you use auto detection wizard.">
						Input MQTT ID
					</Tooltip>
				</dt>
				<dd>
					<input type="text" name="mqtt_id" value={value.mqtt_id} onChange={this.change} />
				</dd>
			</React.Fragment>
		);
	}

	renderIP() {
		const value = this.props.value;
		if(value.type=='dummy')
			return;

		return (
			<React.Fragment>
				<dt>
					<Tooltip content="IP address of the Shelly device (can be found in Shelly app or Autodetected). Will be configured automatically if you use auto detection wizard.">
						IP address
					</Tooltip>
				</dt>
				<dd>
					<input type="text" name="ip" value={value.ip} onChange={this.change} />
				</dd>
			</React.Fragment>
		);
	}

	render() {
		let value = this.props.value;
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Type of Shelly device used to switch on or off your device">
						Device input type
					</Tooltip>
				</dt>
				<dd>
					<div className="sc-select-controltype">
						{this.renderTiles()}
					</div>
				</dd>
				{this.renderIP()}
				{this.renderMQTT()}
				{this.renderOutlet()}
			</React.Fragment>
		);
	}
}
