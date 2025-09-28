import {Select} from '../../ui/Select.js';
import {Tooltip} from '../../ui/Tooltip.js';

export class BatteryPolicy extends React.Component
{
	constructor(props) {
		super(props);

		this.tips = {
			battery: "Battery is always used as long as SOC is sufficient. Switch to grid only occurs when battery is empty according to battery backup configuration.",
			grid: "Grid is always used. This is a manual or maintenance mode.",
			offload: "Grid is used whenever enough power is available. Battery will be used at night or if available power is insufficient to offload."
		}
	}

	render() {
		let value = this.props.value;
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Sets how battery vs grid should be used">
						Usage policy
					</Tooltip>
				</dt>
				<dd>
					<Select name="policy" value={this.props.value} values={[{name: 'Battery', value: 'battery'}, {name: 'Offload', value: 'offload'}, {name: 'Grid', value: 'grid'}]} onChange={this.props.onChange} />
					<br /><i>{this.tips[this.props.value]}</i>
				</dd>
			</React.Fragment>
		);
	}
}
