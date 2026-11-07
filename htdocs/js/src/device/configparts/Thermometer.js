import {Tooltip} from '../../ui/Tooltip.js';
import {SelectHTDevice} from '../../ui/SelectHTDevice.js';

export class Thermometer extends React.Component
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
					<SelectHTDevice type="temperature" name="ht_device_id" value={value.ht_device_id} onChange={this.props.onChange} />
				</div>
			</div>
		);
	}
}
