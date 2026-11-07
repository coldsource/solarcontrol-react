import {Tooltip} from '../../ui/Tooltip.js';
import {TimeRanges} from '../../ui/TimeRanges.js';

export class Offload extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		let value = this.props.value;
		return (
			<div className="layout-form">
				<div>
					<div>
						<Tooltip content="When offloading, the device will only be switched on if at least this power is available from PV. You can usually find this value on the device.">
							Expected consumption (W)
						</Tooltip>
					</div>
					<input type="number" name="expected_consumption" value={value.expected_consumption} onChange={this.props.onChange} />
				</div>
				<div className="spacer"></div>
				<div>
					<div></div>
					<TimeRanges name="offload" value={value.offload} onChange={this.props.onChange} options={this.props.options} />
				</div>
			</div>
		);
	}
}
