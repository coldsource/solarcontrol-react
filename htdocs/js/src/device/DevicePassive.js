import {App} from '../app/App.js';
import {API} from '../websocket/API.js';
import {Device as ProtocolDevice} from '../websocket/Device.js';
import {Subscreen} from '../ui/Subscreen.js';
import {Loader} from '../ui/Loader.js';
import {SelectLetter} from '../ui/SelectLetter.js';

export class DevicePassive extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			device: null,
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
				device_type: this.props.device_type,
				device_name: 'New device',
				device_config: {
					control: {
						type: '3em',
						mqtt_id: "",
						phase: "a"
					}
				}
			}});
		}
		else
		{
			let device = ProtocolDevice.instance.GetPassive(this.props.id);
			this.setState({device: device});
		}
	}

	save() {
		const device = this.state.device;
		const config = device.device_config;

		let params = {
			device_name: device.device_name,
			device_config: {control: {type: '3em'}}
		};

		params.device_config.control.mqtt_id = config.control.mqtt_id;
		params.device_config.control.phase = config.control.phase;

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

		API.instance.command('devicepassive', cmd, params).then(res => {
			App.message("Device saved");
			this.props.onClose();
		});
	}

	deletedevice() {
		API.instance.command('devicepassive', 'delete', {device_id:parseInt(this.state.device.device_id)}).then(res => {
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
		config.control[ev.target.name] = ev.target.value;

		let device = Object.assign({}, this.state.device);
		device.device_config = config;
		this.setState({device: device});
	}

	render3EMFields() {
		const device = this.state.device;

		if(device.device_type!='passive')
			return;

		const config = device.device_config;

		return (
			<React.Fragment>
				<dt>MQTT ID</dt>
				<dd><input type="text" name="mqtt_id" value={config.control.mqtt_id} onChange={this.changeConfig} /></dd>
				<dt>Phase</dt>
				<dd><SelectLetter from="a" to="c" name="phase" value={config.control.phase} onChange={this.changeConfig} /></dd>
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
							<dt>Name</dt>
							<dd><input type="text" name="device_name" value={device.device_name} onChange={this.changeDevice} /></dd>
							{this.render3EMFields()}
						</dl>
						<div className="submit" onClick={this.save}>Save</div>
						{this.renderDelete()}
					</div>
				</Subscreen>
			</div>
		);
	}
}
