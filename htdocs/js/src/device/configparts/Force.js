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
			<div className="form-layout">
				<div>
					<div></div>
					<TimeRanges name="force" value={value} onChange={this.props.onChange} options={this.props.options} />
				</div>
			</div>
		);
	}
}
