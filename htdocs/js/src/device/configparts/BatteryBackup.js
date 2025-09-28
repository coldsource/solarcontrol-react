import {SliderDuration} from '../../ui/SliderDuration.js';
import {Tooltip} from '../../ui/Tooltip.js';

export class BatteryBackup extends React.Component
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

		this.props.onChange({target: {name: this.props.name, value: config}});
	}
	render() {
		let value = this.props.value;
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Controller will switch to grid if this threshold is reached">
						Battery low threshold
					</Tooltip>
				</dt>
				<dd>
					<input type="number" min="0" max="100" name="battery_low" value={value.battery_low} onChange={this.change} />
				</dd>
				<dt>
					<Tooltip content="Controller will back to battery at this threshold">
						Battery high threshold
					</Tooltip>
				</dt>
				<dd>
					<input type="number" min="0" max="100" name="battery_high" value={value.battery_high} onChange={this.change} />
				</dd>
				<dt>
					<Tooltip content="After switching from battery to grid, Controller will not switch back to battery before this time">
						Minimum grid time
					</Tooltip>
				</dt>
				<dd>
					<SliderDuration name="min_grid_time" value={value.min_grid_time} onChange={this.change} long={true} />
				</dd>
			</React.Fragment>
		);
	}
}
