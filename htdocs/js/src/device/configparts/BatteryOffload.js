import {Tooltip} from '../../ui/Tooltip.js';

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
			<React.Fragment>
				<dt>
					<Tooltip content="Maximum power to take from battery when offloading. This is the maximum absolute power, including consumption from non offloading devices. Allowed units are w and kw.">
						Offload max power (W)
					</Tooltip>
				</dt>
				<dd>
					<input type="text" name="max" value={value.max} onChange={this.change} />
				</dd>
				<dt>
					<Tooltip content="Offload will be allowed until this SOC if reached">
						Battery offload low threshold (%)
					</Tooltip>
				</dt>
				<dd>
					<input type="number" min="0" max="100" name="soc_low" value={value.soc_low} onChange={this.change} />
				</dd>
				<dt>
					<Tooltip content="Once low threshold is reached, offload will be forbidden until this SOC is reached">
						Battery offload high threshold (%)
					</Tooltip>
				</dt>
				<dd>
					<input type="number" min="0" max="100" name="soc_high" value={value.soc_high} onChange={this.change} />
				</dd>
			</React.Fragment>
		);
	}
}
