import {Tooltip} from '../../ui/Tooltip.js';
import {SelectHTDevice} from '../../ui/SelectHTDevice.js';
import {ConfigBlock} from '../../ui/ConfigBlock.js';

export class Thermometer extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		let value = this.props.value;
		return (
			<ConfigBlock title="Thermometer">
				<dt>
					<Tooltip content="Themometer used to get current temperature.">
						Linked thermometer
					</Tooltip>
				</dt>
				<dd>
					<SelectHTDevice type="temperature" name="ht_device_id" value={value.ht_device_id} onChange={this.props.onChange} />
				</dd>
			</ConfigBlock>
		);
	}
}
