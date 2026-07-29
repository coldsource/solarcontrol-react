import {API} from '../websocket/API.js';
import {Device as ProtocolDevice} from '../websocket/Device.js';

export class SelectBatteryControllerDevice extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			elec_devices: ProtocolDevice.instance.GetElectrical(0)
		}
	}

	isSelected(device_id)
	{
		return (this.props.value==device_id);
	}

	change(device_id) {
		return this.props.onChange({target: {name: this.props.name, value: device_id}})
	}

	renderState(device) {
		return (<i className={'scf ' + (device.state?'scf-electricity':'scf-battery')} />);
	}

	renderTiles() {
		return this.state.elec_devices.map(elec_device => {
			if(elec_device.device_type!='controller')
				return;

			return (
				<div
					key={elec_device.device_id}
					className={(this.isSelected(elec_device.device_id))?'selected':''}
					onClick={() => this.change(elec_device.device_id)}
				>
					<span className="temperature">{this.renderState(elec_device)}</span>
					<span className="name">{elec_device.device_name}</span>
				</div>
			);
		});
	}

	render() {
		return (
			<div className="sc-select-htdevice">
				<div key="0" className={this.props.value==0?'selected':''} onClick={() => this.change(0)}>
					<span className="temperature"><i className="scf scf-cross" /></span>
					<span className="name">None</span>
				</div>
				{this.renderTiles()}
			</div>
		);
	}
}
