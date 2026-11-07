import {SliderDuration} from '../../ui/SliderDuration.js';
import {TimeRanges} from '../../ui/TimeRanges.js';

export class Remainder extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		let value = this.props.value;

		return (
			<div className="layout-form">
				<div>
					<div>Ensure minimum charging time of</div>
					<SliderDuration name="min_on_time" value={value.min_on_time} onChange={this.props.onChange} />
				</div>
				<div>
					<div>For the last</div>
					<SliderDuration name="min_on_for_last" value={value.min_on_for_last} long={true} onChange={this.props.onChange} />
				</div>
				<div className="spacer"></div>
				<div>
					<div></div>
					<TimeRanges name="remainder" value={value.remainder} onChange={this.props.onChange} />
				</div>
			</div>
		);
	}
}
