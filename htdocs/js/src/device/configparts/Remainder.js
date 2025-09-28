import {SliderDuration} from '../../ui/SliderDuration.js';
import {Tooltip} from '../../ui/Tooltip.js';
import {TimeRanges} from '../../ui/TimeRanges.js';

export class Remainder extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		let value = this.props.value;
		let tooltip = "Compute how long this device has been turned on during the period represented by «\xa0For the last\xa0». If the device has been on for less than «\xa0Ensure minimum charging time of\xa0», it will be switched on in the period indicated by «\xa0During this period\xa0» to make the remainder.";

		return (
			<React.Fragment>
				<dt>
					<Tooltip content={tooltip}>
						Ensure minimum charging time of
					</Tooltip>
				</dt>
				<dd><SliderDuration name="min_on_time" value={value.min_on_time} onChange={this.props.onChange} /></dd>
				<dt>
					<Tooltip content={tooltip}>
						For the last
					</Tooltip>
				</dt>
				<dd><SliderDuration name="min_on_for_last" value={value.min_on_for_last} long={true} onChange={this.props.onChange} /></dd>
				<dt>
					<Tooltip content={tooltip}>
						During this period
					</Tooltip>
				</dt>
				<dd><TimeRanges name="remainder" value={value.remainder} onChange={this.props.onChange} /></dd>
			</React.Fragment>
		);
	}
}
