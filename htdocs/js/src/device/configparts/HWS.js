import {Tooltip} from '../../ui/Tooltip.js';
import {TimeRanges} from '../../ui/TimeRanges.js';
import {SliderDuration} from '../../ui/SliderDuration.js';

export class HWS extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		let value = this.props.value;
		let tooltip = "Compute how many energy has been taken by HWS during the period represented by «\xa0For the last\xa0». If HWS has taken less than «\xa0Ensure minimum Wh of\xa0», it will be switched on in the period indicated by «\xa0During this period\xa0» to make the remainder.";
		return (
			<React.Fragment>
				<dt>
					<Tooltip content={tooltip}>
						Ensure minimum Wh of
					</Tooltip>
				</dt>
				<dd><input type="number" name="min_energy" value={value.min_energy} onChange={this.props.onChange} /></dd>
				<dt>
					<Tooltip content={tooltip}>
						For the last
					</Tooltip>
				</dt>
				<dd><SliderDuration type="days" name="min_energy_for_last" value={value.min_energy_for_last} long={true} onChange={this.props.onChange} /></dd>
				<dt>
					<Tooltip content={tooltip}>
						During this period
					</Tooltip>
				</dt>
				<dd>
					<TimeRanges name="remainder" value={value.remainder} onChange={this.props.onChange} />
				</dd>
			</React.Fragment>
		);
	}
}
