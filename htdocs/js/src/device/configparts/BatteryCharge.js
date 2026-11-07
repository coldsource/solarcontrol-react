import {Tooltip} from '../../ui/Tooltip.js';
import {TimeRanges} from '../../ui/TimeRanges.js';

export class BatteryCharge extends React.Component
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
						<Tooltip content="Charging will be enabled if battery SOC is below this percentage">
							Charge when SOC below (%)
						</Tooltip>
					</div>
					<input type="number" min="0" max="100" name="soc_low" value={value.soc_low} onChange={this.change} />
				</div>
				<div>
					<div>
						<Tooltip content="Charging will continue until this SOC percentage is reached">
							Charge until SOC (%)
						</Tooltip>
					</div>
					<input type="number" min="0" max="100" name="soc_high" value={value.soc_high} onChange={this.change} />
				</div>
				<div className="spacer"></div>
				<div>
					<div></div>
					<TimeRanges name="timeranges" value={value.timeranges} onChange={this.change} />
				</div>
			</div>
		);
	}
}
