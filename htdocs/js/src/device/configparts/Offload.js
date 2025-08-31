import {Tooltip} from '../../ui/Tooltip.js';
import {TimeRanges} from '../../ui/TimeRanges.js';
import {ConfigBlock} from '../../ui/ConfigBlock.js';

export class Offload extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		let value = this.props.value;
		return (
			<ConfigBlock title="Offload">
				<dt>
					<Tooltip content="When offloading, the device will only be switched on if at least this power is available from PV. You can usually find this value on the device.">
						Expected consumption (W)
					</Tooltip>
				</dt>
				<dd><input type="number" name="expected_consumption" value={value.expected_consumption} onChange={this.props.onChange} /></dd>
				<dt>
					<Tooltip content="Time ranges when the device will be in «&#160;Offload&#160;» mode. In offload mode the device will be switched on only if sufficient PV power is available (see «&#160;Expected Consumption&#160;»). Leaf indicates offpeak hours if configured.">
						Period
					</Tooltip>
				</dt>
				<dd>
					<TimeRanges name="offload" value={value.offload} onChange={this.props.onChange} options={this.props.options} />
				</dd>
			</ConfigBlock>
		);
	}
}
