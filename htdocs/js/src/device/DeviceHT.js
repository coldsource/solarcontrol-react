import {App} from '../app/App.js';
import {API} from '../websocket/API.js';
import {Device as ProtocolDevice} from '../websocket/Device.js';
import {Subscreen} from '../ui/Subscreen.js';
import {Loader} from '../ui/Loader.js';
import {DeviceConfig} from './DeviceConfig.js';
import {AutodetectBLE} from './AutodetectBLE.js';

export class DeviceHT extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			device: null,
			autodetect: false,
		};

		this.config_parts = {
			ht: ['Name', 'MQTT'],
			htmini: ['Name', 'BLE'],
			wind: ['Name', 'MQTT'],
		};

		this.save = this.save.bind(this);
		this.deletedevice = this.deletedevice.bind(this);
		this.changeConfig = this.changeConfig.bind(this);
		this.autoConfig = this.autoConfig.bind(this);
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
			let device = ProtocolDevice.instance.GetHT(this.props.id);
			this.setState({device: device});
		}
	}

	async save() {
		const device = this.state.device;
		const config = device.device_config;

		await API.instance.command('deviceht', this.props.id!=0?'set':'create', device);
		App.message("Device saved");
		this.props.onClose();
	}

	deletedevice() {
		API.instance.command('deviceht', 'delete', {device_id:parseInt(this.state.device.device_id)}).then(res => {
			App.message("Device removed");
			this.props.onClose();
		});
	}

	changeConfig(device) {
		this.setState({device: device});
	}

	renderDelete() {
		if(this.props.id==0)
			return;

		return (
			<React.Fragment>
				<br />
				<div className="warning-btn" onClick={this.deletedevice}>Remove device</div>
			</React.Fragment>
		);
	}

	autoConfig(addr) {

		let device = this.state.device;
		let config = device.device_config;

		if(addr)
			config.ble_addr = addr;

		this.setState({autodetect: false, device: device});
	}

	renderAutoDetectBLE() {
		if(this.props.id!=0)
			return;

		if(this.state.device.device_type!='htmini')
			return;

		return (
			<div className="wizard" onClick={ () => this.setState({autodetect: true}) }>
				<i className="scf scf-wizard" /> Autodetect
			</div>
		);
	}

	render() {
		const device = this.state.device;

		if(device===null)
			return (<Loader />);

		if(this.state.autodetect)
		{
			return (
				<div className="sc-device">
					<Subscreen title="Press device's button" onClose={ () => this.setState({autodetect: false}) }>
						<AutodetectBLE onSelect={this.autoConfig} />
					</Subscreen>
				</div>
			);
		}

		let parts = this.props.parts!==undefined?this.props.parts:this.config_parts[device.device_type];

		return (
			<div className="sc-device">
				<Subscreen title={device.device_name} onClose={this.props.onClose}>
					<div className="layout-form">
						{this.renderAutoDetectBLE()}
						<DeviceConfig parts={parts} device={device} onChange={this.changeConfig} />
						<div className="submit" onClick={this.save}>Save</div>
						{this.renderDelete()}
					</div>
				</Subscreen>
			</div>
		);
	}
}
