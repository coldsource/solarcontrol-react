import {App} from '../app/App.js';
import {Device as ProtocolDevice} from '../websocket/Device.js';
import {API} from '../websocket/API.js';
import {Subscreen} from '../ui/Subscreen.js';
import {Loader} from '../ui/Loader.js';
import {DeviceConfig} from './DeviceConfig.js';
import {Autodetect} from './Autodetect.js';

export class DeviceElectrical extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			device: null,
			autodetect: false,
			ip: null
		};

		this.config_parts = {
			timerange: ['Name*', 'Prio*', 'Control*', 'Offload*', 'Force*', 'Remainder*', 'MinOnOff*'],
			heater: ['Name*', 'Prio*', 'Control*', 'Thermometer*', 'OffloadTemperature*', 'ForceTemperature*', 'MinOnOff*'],
			cooler: ['Name*', 'Prio*', 'Control*', 'Thermometer*', 'OffloadTemperature*', 'ForceTemperature*', 'MinOnOff*'],
			cmv: ['Name*', 'Prio*', 'Control*', 'CMV*', 'OffloadMoisture*', 'ForceMoisture*', 'MinOnOffMax*'],
			hws: ['Meter', 'Control', 'Force*', 'HWS'],
			passive: ['Name', 'Meter*'],
			grid: ['Meter', 'OffPeak'],
			pv: ['Meter'],
			battery: ['Name*', 'Prio*', 'Voltmeter*', 'Meter', 'ControlBattery', 'BatteryPolicy*', 'BatteryBackup*'],
			controller: ['Name*', 'Prio*', 'ControlBattery*', 'Offload*', 'Force*'],
		}

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
			let device = ProtocolDevice.instance.GetElectrical(this.props.id);
			this.setState({device: device});
		}
	}

	async save() {
		const device = this.state.device;
		const config = device.device_config;

		await API.instance.command('deviceelectrical', this.props.id!=0?'set':'create', device);

		let ip = this.state.ip; // Autodetect IP of any
		if(config.control!==undefined)
			ip = config.control.ip; // Specific IP (might have been filled by autodetect)

		if(ip)
		{
			// Setup shelly device
			await API.instance.command('shelly', 'sysset', {ip: ip, name: device.device_name})
			await this.enableMQTT(ip);
		}

		App.message("Device saved");
		if(device.device_type=='hws')
			return;

		if(this.props.onClose!==undefined)
			this.props.onClose();
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

	async enableMQTT(ip) {
		const device = this.state.device;
		const config = device.device_config;

		let mqtt_id = '';
		if(config.control!==undefined && config.control.mqtt_id)
			mqtt_id = config.control.mqtt_id;
		if(config.meter!==undefined && config.meter.mqtt_id)
			mqtt_id = config.meter.mqtt_id;

		if(mqtt_id=='')
			return; // No MQTT needed

		let mqtt = await API.instance.command('shelly', 'mqttget', {ip: ip});
		if(mqtt.enable)
			return; // Already enabled


		await API.instance.command('shelly', 'mqttset', {ip: ip, server: window.location.hostname + ':1883', topic: mqtt_id});
		await API.instance.command('shelly', 'reboot', {ip: ip});
	}

	async autoConfig(auto_device) {
		let device = this.state.device;
		let config = device.device_config;

		let mqtt = await API.instance.command('shelly', 'mqttget', {ip: auto_device.ip});

		// Set MQTT
		let topic = mqtt.topic_prefix;
		if(!topic)
			topic = 'sc-' + Math.random().toString(16).slice(2);

		// Set control and metering
		if(config.control!==undefined)
		{
			if(auto_device.type=='Pro3')
				config.control.type = 'pro';
			else
				config.control.type = 'plug';

			config.control.ip = auto_device.ip;
			config.control.mqtt_id = topic;
		}

		if(config.meter!==undefined)
		{
			if(auto_device.type=='Pro3EM')
				config.meter.type = '3em';
			else
				config.meter.type = 'plug';

			config.meter.mqtt_id = topic;
		}

		this.setState({autodetect: false, device: device, ip: auto_device.ip});
	}

	renderAutoDetect() {
		if(this.props.id!=0)
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

		let parts = this.props.parts!==undefined?this.props.parts:this.config_parts[device.device_type];

		if(this.state.autodetect)
		{
			return (
				<div className="sc-device">
					<Subscreen title="Autodetected devices" onClose={ () => this.setState({autodetect: false}) }>
						<Autodetect onSelect={this.autoConfig} />
					</Subscreen>
				</div>
			);
		}

		return (
			<div className="sc-device">
				<Subscreen title={device.device_name} onClose={this.props.onClose}>
					<div className="layout-form">
						{this.renderAutoDetect()}
						<DeviceConfig parts={parts} device={device} onChange={this.changeConfig} />
						<div className="submit" onClick={this.save}>Save</div>
						{this.renderDelete()}
					</div>
				</Subscreen>
			</div>
		);
	}
}
