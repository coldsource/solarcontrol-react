import {Tooltip} from '../../ui/Tooltip.js';
import {TimeRanges} from '../../ui/TimeRanges.js';
import {SliderDuration} from '../../ui/SliderDuration.js';
import {InputEnergy} from '../../ui/InputEnergy.js';

export class HWS extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		let value = this.props.value;
		let tooltip = "Compute how many energy has been taken by HWS during the period represented by «\xa0For the last\xa0». If HWS has taken less than «\xa0Ensure minimum Wh of\xa0», it will be switched on in the period indicated by «\xa0During this period\xa0» to make the remainder.";
		return (
			<div className="layout-form">
				<div>
					<div>
						<Tooltip content={tooltip}>
							Ensure minimum Wh of
						</Tooltip>
					</div>
					<InputEnergy name="min_energy" value={value.min_energy} onChange={this.props.onChange} />
				</div>
				<div>
					<div>
						<Tooltip content={tooltip}>
							For the last
						</Tooltip>
					</div>
					<SliderDuration type="days" name="min_energy_for_last" value={value.min_energy_for_last} long={true} onChange={this.props.onChange} />
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
