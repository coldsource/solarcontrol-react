import {Tooltip} from '../../ui/Tooltip.js';
import {InputPower} from '../../ui/InputPower.js';

export class BatteryOffload extends React.Component
{
	constructor(props) {
		super(props);

		this.change = this.change.bind(this);
	}

	change(ev) {
		let config = Object.assign({}, this.props.value);

		const name = ev.target.name;
		let value = ev.target.value;
		if(['soc_low', 'soc_high'].includes(name))
			value = parseFloat(value);

		config[name] = value;

		this.props.onChange({target: {name: this.props.name, value: config}});
	}

	render() {
		let value = this.props.value;
		return (
			<div className="layout-form">
				<div>
					<div>
						<Tooltip content="Maximum power to take from battery when offloading. This is the maximum absolute power, including consumption from non offloading devices. Allowed units are w and kw.">
							Offload max power (W)
						</Tooltip>
					</div>
					<InputPower name="max" value={value.max} onChange={this.change} />
				</div>
				<div>
					<div>
						<Tooltip content="Offload will be allowed until this SOC if reached">
							Battery offload low threshold (%)
						</Tooltip>
					</div>
					<input type="number" min="0" max="100" name="soc_low" value={value.soc_low} onChange={this.change} />
				</div>
				<div>
					<div>
						<Tooltip content="Once low threshold is reached, offload will be forbidden until this SOC is reached">
							Battery offload high threshold (%)
						</Tooltip>
					</div>
					<input type="number" min="0" max="100" name="soc_high" value={value.soc_high} onChange={this.change} />
				</div>
			</div>
		);
	}
}
