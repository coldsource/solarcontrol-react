import {SelectInteger} from '../../ui/SelectInteger.js';
import {Tooltip} from '../../ui/Tooltip.js';
import {Select} from '../../ui/Select.js';
import {SelectIcon} from '../../ui/SelectIcon.js';

export class Control extends React.Component
{
	constructor(props) {
		super(props);

		this.types = [
			{icon: 'scf-plug', name: 'Plug S', value: 'plug'},
			{icon: 'scf-plugs', name: 'Pro', value: 'pro'},
			{icon: 'scf-chip', name: 'Uni', value: 'uni'},
			{icon: 'scf-chip', name: 'Arduino', value: 'arduino'},
			{icon: 'scf-bsb-lan', name: 'BSBLan', value: 'bsblan'},
		];

		this.change = this.change.bind(this);
	}

	change(ev) {
		let config = Object.assign({}, this.props.value);

		const name = ev.target.name;
		let value = ev.target.value;

		if(name=='outlet')
			value = parseInt(value);

		if(name=='type')
		{
			// Config reset
			if(value=='plug')
				config = {type: 'plug', ip: '', mqtt_id: ''};
			else if(value=='pro')
				config = {type: 'pro', ip: '', mqtt_id: '', outlet: 0};
			else if(value=='uni')
				config = {type: 'uni', ip: '', mqtt_id: '', outlet: 0, reverted: true};
			else if(value=='arduino')
				config = {type: 'arduino', mqtt_id: '', reverted: true};
			else if(value=='bsblan')
				config = {type: 'bsblan', ip: ''};
		}
		else
			config[name] = value;

		this.props.onChange({target: {name: this.props.name, value: config}});
	}

	renderIP() {
		const value = this.props.value;
		if(!['plug', 'pro', 'uni', 'bsblan'].includes(value.type))
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
		if(!['pro', 'uni'].includes(value.type))
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
		if(!['plug', 'pro', 'uni', 'arduino'].includes(value.type))
			return;

		return (
			<React.Fragment>
				<dt>
					<Tooltip content="MQTT ID configured on the Shelly device. This is mandatory to get power consumption. Will be configured automatically if you use auto detection wizard.">
						MQTT ID
					</Tooltip>
				</dt>
				<dd><input type="text" name="mqtt_id" value={value} onChange={this.change} /></dd>
			</React.Fragment>
		);
	}

	renderReverted() {
		const value = this.props.value;
		if(!['uni', 'arduino'].includes(value.type))
			return;

		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Sets how controller relay is used">
						When on battery, relay is
					</Tooltip>
				</dt>
				<dd>
					<Select name="reverted" value={value.reverted} values={[{name: 'On', value: true}, {name: 'Off', value: false}]} onChange={this.change} />
				</dd>
			</React.Fragment>
		);
	}

	render() {
		const value = this.props.value;

		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Type of Shelly device used to switch on or off your device">
						Device controller type
					</Tooltip>
				</dt>
				<dd>
					<SelectIcon name="type" values={this.types} value={this.props.value.type} onChange={this.change} />
				</dd>
				{this.renderIP()}
				{this.renderOutlet()}
				{this.renderMQTTID()}
				{this.renderReverted()}
			</React.Fragment>
		);
	}
}
