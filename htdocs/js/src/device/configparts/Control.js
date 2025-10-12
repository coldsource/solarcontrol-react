import {SelectInteger} from '../../ui/SelectInteger.js';
import {Tooltip} from '../../ui/Tooltip.js';
import {Select} from '../../ui/Select.js';

export class Control extends React.Component
{
	constructor(props) {
		super(props);

		this.types = {
			'plug': {icon: 'scf-plug', name: 'Plug S'},
			'pro': {icon: 'scf-plugs', name: 'Pro'},
			'uni': {icon: 'scf-chip', name: 'Uni'},
			'arduino': {icon: 'scf-chip', name: 'Arduino'},
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

			if(value=='pro' || value=='uni')
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

	renderIP() {
		const value = this.props.value;
		if(value.type=='arduino')
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

	renderOutlet() {
		const value = this.props.value;
		if(value.type=='plug' || value.type=='arduino')
			return;

		let max = value.type=='pro'?3:2;

		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Outlet number on the Shelly device">
						Outlet number
					</Tooltip>
				</dt>
				<dd><SelectInteger min={1} max={max} sum={-1} name="outlet" value={value.outlet} onChange={this.change} /></dd>
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

	renderReverted() {
		if(this.props.revert===undefined || !this.props.revert)
			return;

		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Sets how controller relay is used">
						When on battery, relay is
					</Tooltip>
				</dt>
				<dd>
					<Select name="reverted" value={this.props.value.reverted} values={[{name: 'On', value: true}, {name: 'Off', value: false}]} onChange={this.change} />
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
						Device controller type
					</Tooltip>
				</dt>
				<dd>
					<div className="sc-select-controltype">
						{this.renderTiles()}
					</div>
				</dd>
				{this.renderIP()}
				{this.renderOutlet()}
				{this.renderMQTTID()}
				{this.renderReverted()}
			</React.Fragment>
		);
	}
}
