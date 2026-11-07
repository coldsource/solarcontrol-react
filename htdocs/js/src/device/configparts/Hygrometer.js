import {Tooltip} from '../../ui/Tooltip.js';
import {SelectHTDevice} from '../../ui/SelectHTDevice.js';

export class Hygrometer extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		let value = this.props.value;
		return (
			<div className="layout-form">
				<div>
					<div></div>
					<SelectHTDevice SelectHTDevice type="humidity" multiple="yes" name="ht_device_ids" value={value.ht_device_ids} onChange={this.props.onChange} />
				</div>
			</div>
		);
	}
}
