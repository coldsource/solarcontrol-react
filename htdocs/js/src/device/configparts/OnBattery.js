import {Select} from '../../ui/Select.js';
import {SelectBatteryControllerDevice} from '../../ui/SelectBatteryControllerDevice.js';
import {Tooltip} from '../../ui/Tooltip.js';

export class OnBattery extends React.Component
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

		if(name=='enabled' && !value)
			config['controller_id'] = 0; // Reset controller

		this.props.onChange({target: {name: this.props.name, value: config}});
	}

	renderControllerSelector() {
		const value = this.props.value;

		if(!value.enabled)
			return; // Not on battery, no need to choose controller

		return (
			<React.Fragment>
				<dt>
					<Tooltip content="If the device is managed by a controller (ie it can be switched from grid to battery), select the correct controller device">
						Battery Controller
					</Tooltip>
				</dt>
				<dd>
					<SelectBatteryControllerDevice name="controller_id" value={value.controller_id} onChange={this.change} />
				</dd>

			</React.Fragment>
		);
	}

	render() {
		const value = this.props.value;

		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Declare that this devices runs on battery. Offload will be computed based on battery state instead of exported power.">
						Device is on battery
					</Tooltip>
				</dt>
				<dd>
					<Select name="enabled" value={value.enabled} values={[{name: 'Yes', value: true}, {name: 'No', value: false}]} onChange={this.change} />
				</dd>
				{this.renderControllerSelector()}
			</React.Fragment>
		);
	}
}
