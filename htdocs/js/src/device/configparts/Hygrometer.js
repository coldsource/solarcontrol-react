import {Tooltip} from '../../ui/Tooltip.js';
import {SelectHTDevice} from '../../ui/SelectHTDevice.js';
import {ConfigBlock} from '../../ui/ConfigBlock.js';

export class Hygrometer extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		let value = this.props.value;
		return (
			<ConfigBlock title="Hygrometers">
				<dt>
					<Tooltip content="Hygrometer used to get current humidity.">
						Linked hygrometers
					</Tooltip>
				</dt>
				<dd>
					<SelectHTDevice SelectHTDevice type="humidity" multiple="yes" name="ht_device_ids" value={value.ht_device_ids} onChange={this.props.onChange} />
				</dd>
			</ConfigBlock>
		);
	}
}
