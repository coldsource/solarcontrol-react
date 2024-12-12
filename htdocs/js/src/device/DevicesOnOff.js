import {Device as ProtocolDevice} from '../websocket/Device.js';
import {API} from '../websocket/API.js';
import {SelectDeviceType} from '../ui/SelectDeviceType.js';
import {DeviceOnOff} from './DeviceOnOff.js';
import {DevicePassive} from './DevicePassive.js';
import {ControlOnOff} from '../ui/ControlOnOff.js';
import {KW} from '../ui/KW.js';
import {Subscreen} from '../ui/Subscreen.js';

export class DevicesOnOff extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			devices_onoff: [],
			devices_passive: [],
			editing: false,
			creating: false,
			editing_type: "",
			device_type: "",
		};

		this.interval = null;

		this.changeDeviceType = this.changeDeviceType.bind(this);
		this.close = this.close.bind(this);
		this.reload_onoff = this.reload_onoff.bind(this);
		this.reload_passive = this.reload_passive.bind(this);
	}

	componentDidMount() {
		ProtocolDevice.instance.Subscribe('onoff', 0, this.reload_onoff);
		ProtocolDevice.instance.Subscribe('passive', 0, this.reload_passive);
	}

	componentWillUnmount() {
		ProtocolDevice.instance.Unsubscribe('onoff', 0, this.reload_onoff);
		ProtocolDevice.instance.Unsubscribe('passive', 0, this.reload_passive);
	}

	reload_onoff(devices) {
		this.setState({devices_onoff: devices});
	}

	reload_passive(devices) {
		this.setState({devices_passive: devices});
	}

	changeDeviceType(ev) {
		let type;
		if(['heater', 'cmv', 'timerange'].indexOf(ev.target.value)>=0)
			type = 'onoff';
		else if(['passive'].indexOf(ev.target.value)>=0)
			type = 'passive';

		this.setState({creating: false, editing: 0, editing_type: type, device_type: ev.target.value});
	}

	close() {
		this.setState({editing: false, editing_type: "", creating: false});
	}

	edit(id, type) {
		this.setState({editing: id, editing_type: type});
	}

	setManualState(id, state) {
		API.instance.command('deviceonoff', 'setstate', {device_id: id, state: state});
	}

	renderPower(power) {
		if(power<0)
			return;

		return (
			<React.Fragment><i className="fa fa-bolt" /> <KW value={power} /></React.Fragment>
		);
	}

	renderDevicesOnOff() {
		return this.state.devices_onoff.map(device => {
			return (
				<div key={device.device_id}>
					<div>
						<i className={"fa " + ((device.manual)?'fa-hand':'fa-regular fa-sun-bright')} onClick={() => { if(device.manual) this.setManualState(device.device_id, "auto") }} />
					</div>
					<div>
						<span className="name" onClick={ () => this.edit(device.device_id, "onoff") }>{device.device_name}</span>
						<div className="power">
							{this.renderPower(device.power)}
						</div>
					</div>
					<div>
						<ControlOnOff device_id={device.device_id} state={device.state} />
					</div>
				</div>
			);
		});
	}

	renderDevicesPassive() {
		return this.state.devices_passive.map(device => {
			return (
				<div key={device.device_id}>
					<div>
						<i className={"fa " + ((device.manual)?'fa-hand':'fa-regular fa-gauge-simple-min')} />
					</div>
					<div>
						<span className="name" onClick={ () => this.edit(device.device_id, "passive") }>{device.device_name}</span>
						<div className="power">
							{this.renderPower(device.power)}
						</div>
					</div>
					<div></div>
				</div>
			);
		});
	}

	renderDeviceType() {
		return (
			<Subscreen title="New device type" onClose={() => this.setState({creating: false})}>
				<SelectDeviceType name="editing_type" value="" onChange={this.changeDeviceType} />
			</Subscreen>
		);
	}

	render() {
		if(this.state.editing!==false)
		{
			if(this.state.editing_type=="onoff")
				return (<DeviceOnOff id={this.state.editing} device_type={this.state.device_type} onClose={this.close} />);
			else if(this.state.editing_type=="passive")
				return (<DevicePassive id={this.state.editing} device_type={this.state.device_type} onClose={this.close} />);
		}

		if(this.state.creating)
			return this.renderDeviceType();

		return (
			<div className="sc-devices">
				<div className="actions">
					<i className="fa fa-plus" onClick={ () => this.setState({creating: true}) }></i>
				</div>
				<div className="list">
					{this.renderDevicesOnOff()}
					{this.renderDevicesPassive()}
				</div>
			</div>
		);
	}
}
