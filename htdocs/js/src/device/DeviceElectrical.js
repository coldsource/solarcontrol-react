import {App} from '../app/App.js';
import {Device as ProtocolDevice} from '../websocket/Device.js';
import {API} from '../websocket/API.js';
import {Subscreen} from '../ui/Subscreen.js';
import {Loader} from '../ui/Loader.js';
import {DeviceConfig} from './DeviceConfig.js';

export class DeviceElectrical extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			device: null,
		};

		this.config_parts = {
			timerange: ['Name', 'Prio', 'Control', 'ExpectedConsumption', 'Offload', 'Force', 'Remainder', 'MinOnOff'],
			heater: ['Name', 'Prio', 'Control', 'Heater', 'ExpectedConsumption', 'Offload', 'Force', 'MinOnOff'],
			cmv: ['Name', 'Prio', 'Control', 'CMV', 'ExpectedConsumption', 'Offload', 'Force', 'MinOnOff', 'MaxOn'],
			hws: ['Meter', 'Control', 'Force', 'HWS'],
			passive: ['Name', 'Meter'],
			grid: ['Meter'],
			pv: ['Meter']
		}

		this.save = this.save.bind(this);
		this.deletedevice = this.deletedevice.bind(this);
		this.changeConfig = this.changeConfig.bind(this);
	}

	componentDidMount() {
		if(this.props.id==0)
		{
			this.setState({device: {
				device_type: this.props.device_type,
				device_name: 'New device'
			}});
		}
		else
		{
			let device = ProtocolDevice.instance.GetElectrical(this.props.id);
			if(device.device_type=='hws')
				device.device_config.min_energy_for_last = device.device_config.min_energy_for_last * 86400; // Convert days to seconds

			this.setState({device: device});
		}
	}

	save() {
		const device = this.state.device;

		API.instance.command('deviceelectrical', this.props.id!=0?'set':'create', device).then(res => {
			App.message("Device saved");
			if(device.device_type=='hws')
				return;

			this.props.onClose();
		});
	}

	deletedevice() {
		API.instance.command('deviceelectrical', 'delete', {device_id:parseInt(this.state.device.device_id)}).then(res => {
			App.message("Device removed");
			this.props.onClose();
		});
	}

	changeConfig(device) {
		this.setState({device: device});
	}

	renderDelete() {
		if(this.props.id<=0)
			return; // Special devices can't be deleted

		return (
			<React.Fragment>
				<br />
				<div className="warning-btn" onClick={this.deletedevice}>Remove device</div>
			</React.Fragment>
		);
	}

	render() {
		const device = this.state.device;

		if(device===null)
			return (<Loader />);

		let parts = this.props.parts!==undefined?this.props.parts:this.config_parts[device.device_type];

		return (
			<div className="sc-device">
				<Subscreen title={device.device_name} onClose={this.props.onClose}>
					<div className="layout-form">
						<DeviceConfig parts={parts} device={device} onChange={this.changeConfig} />
						<div className="submit" onClick={this.save}>Save</div>
						{this.renderDelete()}
					</div>
				</Subscreen>
			</div>
		);
	}
}
