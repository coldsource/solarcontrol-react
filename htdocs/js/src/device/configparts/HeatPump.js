import {Tooltip} from '../../ui/Tooltip.js';

export class HeatPump extends React.Component
{
	constructor(props) {
		super(props);

		this.change = this.change.bind(this);
	}

	change(ev) {
		let config = Object.assign({}, this.props.value);

		const name = ev.target.name;
		let value = parseFloat(ev.target.value);

		this.props.onChange({target: {name: name, value: value}});
	}

	render() {
		let value = this.props.value;
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Offset between current temperature and set temperature of the heat pump. A low value will make heat pump consume less power but also heat more slowly. Setting for slow mode.">
						Temperature offset (slow)
					</Tooltip>
				</dt>
				<dd>
					<input type="number" name="temperature_offset" value={value.temperature_offset_slow} onChange={this.change} />
				</dd>
				<dt>
					<Tooltip content="Offset between current temperature and set temperature of the heat pump. A low value will make heat pump consume less power but also heat more slowly. Setting for fast mode.">
						Temperature offset (fast)
					</Tooltip>
				</dt>
				<dd>
					<input type="number" name="temperature_offset" value={value.temperature_offset_fast} onChange={this.change} />
				</dd>
				<dt>
					<Tooltip content="Temperature setpoint when heat pump is off">
						Eco temperature
					</Tooltip>
				</dt>
				<dd>
					<input type="number" name="temperature_eco" value={value.temperature_eco} onChange={this.change} />
				</dd>
				<dt>
					<Tooltip content="Temperature setpoint when heat pump is on">
						Comfort temperature
					</Tooltip>
				</dt>
				<dd>
					<input type="number" name="temperature_comfort" value={value.temperature_comfort} onChange={this.change} />
				</dd>
			</React.Fragment>
		);
	}
}
