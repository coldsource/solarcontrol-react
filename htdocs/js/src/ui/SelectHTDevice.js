import {API} from '../websocket/API.js';
import {Device as ProtocolDevice} from '../websocket/Device.js';

export class SelectHTDevice extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			ht_devices: ProtocolDevice.instance.GetHT(0)
		}
	}

	isSelected(device_id)
	{
		if(this.props.multiple=="no")
			return (this.props.value==device_id);
		return (this.props.value.indexOf(device_id)!=-1);
	}

	change(device_id) {
		if(this.props.multiple=="no")
			return this.props.onChange({target: {name: this.props.name, value: device_id}})

			let new_value = [...this.props.value];
		let idx = new_value.indexOf(device_id);
		if(idx==-1)
			new_value.push(device_id);
		else
			new_value.splice(idx, 1);

		return this.props.onChange({target: {name: this.props.name, value: new_value}})
	}

	renderTempHum(device) {
		if(this.props.type=="temperature")
			return device.temperature + ' °C';
		else
			return device.humidity + ' %';
	}

	renderTiles() {
		return this.state.ht_devices.map(ht_device => {
			return (
				<div
					key={ht_device.device_id}
					className={(this.isSelected(ht_device.device_id))?'selected':''}
					onClick={() => this.change(ht_device.device_id)}
				>
					<span className="temperature">{this.renderTempHum(ht_device)}</span>
					<span className="name">{ht_device.device_name}</span>
				</div>
			);
		});
	}

	render() {
		return (
			<div className="sc-select-htdevice">
				{this.renderTiles()}
			</div>
		);
	}
}

SelectHTDevice.defaultProps = {
	type: 'temperature',
	multiple: 'no'
}
