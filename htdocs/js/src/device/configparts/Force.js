import {Tooltip} from '../../ui/Tooltip.js';
import {TimeRanges} from '../../ui/TimeRanges.js';

export class Force extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		let value = this.props.value;
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Time ranges when the device will be in «&#160;Forced&#160;» mode. In forced mode the device will be switched on whatever the current production is. Leaf indicates offpeak hours if configured.">
						Time slots
					</Tooltip>
				</dt>
				<dd>
					<TimeRanges name="force" value={value.force} onChange={this.props.onChange} options={this.props.options} />
				</dd>
			</React.Fragment>
		);
	}
}
