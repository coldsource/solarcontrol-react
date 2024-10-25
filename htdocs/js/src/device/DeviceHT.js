import {App} from '../app/App.js';
import {API} from '../websocket/API.js';
import {Subscreen} from '../ui/Subscreen.js';
import {Loader} from '../ui/Loader.js';
import {SelectDeviceTypeHT} from '../ui/SelectDeviceTypeHT.js';

export class DeviceHT extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			device: null,
			ht_devices: []
		};

		this.save = this.save.bind(this);
		this.deletedevice = this.deletedevice.bind(this);
		this.changeDevice = this.changeDevice.bind(this);
		this.changeConfig = this.changeConfig.bind(this);
	}

	componentDidMount() {
		if(this.props.id==0)
		{
			this.setState({device: {
				device_type: 'ht',
				device_name: 'New device',
				device_config: {
					mqtt_id: "",
					ble_addr: ""
				}
			}});
		}
		else
		{
			API.instance.command('deviceht', 'get', {device_id: parseInt(this.props.id)}).then(device => {
				this.setState({device: device});
			});
		}
	}

	save() {
		const device = this.state.device;
		const config = device.device_config;

		let params = {
			device_name: device.device_name,
			device_config: {}
		};

		if(device.device_type=='ht')
			params.device_config.mqtt_id = config.mqtt_id;

		if(device.device_type=='htmini')
			params.device_config.ble_addr = config.ble_addr;

		let cmd;
		if(this.props.id!=0)
		{
			params.device_id = parseInt(device.device_id);
			cmd = 'set';
		}
		else
		{
			params.device_type = device.device_type;
			cmd = 'create';
		}

		API.instance.command('deviceht', cmd, params).then(res => {
			App.message("Device saved");
			this.props.onClose();
		});
	}

	deletedevice() {
		API.instance.command('deviceht', 'delete', {device_id:parseInt(this.state.device.device_id)}).then(res => {
			App.message("Device removed");
			this.props.onClose();
		});
	}

	changeDevice(ev) {
		let device = Object.assign({}, this.state.device);
		device[ev.target.name] = ev.target.value;
		this.setState({device: device});
	}

	changeConfig(ev) {
		let config = Object.assign({}, this.state.device.device_config);
		config[ev.target.name] = ev.target.value;

		let device = Object.assign({}, this.state.device);
		device.device_config = config;
		this.setState({device: device});
	}

	renderDeviceType() {
		if(this.props.id!=0)
			return;

		const device = this.state.device;

		return (
			<SelectDeviceTypeHT name="device_type" value={device.device_type} onChange={this.changeDevice} />
		);
	}

	renderHTFields() {
		const device = this.state.device;

		if(device.device_type!='ht')
			return;

		const config = device.device_config;

		return (
			<React.Fragment>
				<dt>MQTT ID</dt>
				<dd><input type="text" name="mqtt_id" value={config.mqtt_id} onChange={this.changeConfig} /></dd>
			</React.Fragment>
		);
	}

	renderHTMiniFields() {
		const device = this.state.device;

		if(device.device_type!='htmini')
			return;

		const config = device.device_config;
		console.log(config.ble_addr);

		return (
			<React.Fragment>
				<dt>Bluetooth address</dt>
				<dd><input type="text" name="ble_addr" value={config.ble_addr} onChange={this.changeConfig} /></dd>
			</React.Fragment>
		);
	}

	renderDelete() {
		if(this.props.id==0)
			return;

		if(this.state.device!==null && this.state.device.device_type=='hws')
			return;

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

		const config = device.device_config;

		return (
			<div className="sc-device">
				<Subscreen title={device.device_name} onClose={this.props.onClose}>
					<div className="layout-form">
						<dl>
							{this.renderDeviceType()}
							<dt>Name</dt>
							<dd><input type="text" name="device_name" value={device.device_name} onChange={this.changeDevice} /></dd>
							{this.renderHTFields()}
							{this.renderHTMiniFields()}
						</dl>
						<div className="submit" onClick={this.save}>Save</div>
						{this.renderDelete()}
					</div>
				</Subscreen>
			</div>
		);
	}
}
