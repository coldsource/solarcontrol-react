import {Device as ProtocolDevice} from '../websocket/Device.js';
import {API} from '../websocket/API.js';
import {SelectDeviceType} from '../ui/SelectDeviceType.js';
import {DeviceElectrical} from './DeviceElectrical.js';
import {ControlOnOff} from '../ui/ControlOnOff.js';
import {KW} from '../ui/KW.js';
import {Subscreen} from '../ui/Subscreen.js';

export class DevicesElectrical extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			devices: [],
			editing: false,
			creating: false,
			device_type: "",
		};

		this.interval = null;

		this.changeDeviceType = this.changeDeviceType.bind(this);
		this.close = this.close.bind(this);
		this.reload = this.reload.bind(this);
	}

	componentDidMount() {
		ProtocolDevice.instance.Subscribe('electrical', 0, this.reload);
	}

	componentWillUnmount() {
		ProtocolDevice.instance.Unsubscribe('electrical', 0, this.reload);
	}

	reload(devices) {
		devices.sort((dev1, dev2) => {
			if(dev1.device_name.toUpperCase()<dev2.device_name.toUpperCase())
				return -1;
			return 1;
		});

		this.setState({devices: devices});
	}

	changeDeviceType(ev) {
		this.setState({creating: false, editing: 0, device_type: ev.target.value});
	}

	close() {
		this.setState({editing: false, creating: false});
	}

	edit(id) {
		this.setState({editing: id});
	}

	setManualState(id, state) {
		API.instance.command('deviceelectrical', 'setstate', {device_id: id, state: state});
	}

	renderPower(power) {
		if(power<0)
			return;

		return (
			<React.Fragment><i className="scf scf-bolt" /> <KW value={power} /></React.Fragment>
		);
	}

	renderDevices() {
		return this.state.devices.map(device => {
			let cl_auto = device.device_type=='passive'?'scf-meter':'scf-sun';

			return (
				<div key={device.device_id}>
					<div>
						<i className={"scf " + ((device.manual)?'scf-hand':cl_auto)} onClick={() => { if(device.manual) this.setManualState(device.device_id, "auto") }} />
					</div>
					<div>
						<span className="name" onClick={ () => this.edit(device.device_id) }>{device.device_name}</span>
						<div className="power">
							{this.renderPower(device.power)}
						</div>
					</div>
					<div>
						{device.device_type!='passive'?(<ControlOnOff device_id={device.device_id} state={device.state} />):null}
					</div>
				</div>
			);
		});
	}

	renderDeviceType() {
		return (
			<Subscreen title="New device type" onClose={() => this.setState({creating: false})}>
				<SelectDeviceType name="device_type" value="" onChange={this.changeDeviceType} />
			</Subscreen>
		);
	}

	render() {
		if(this.state.editing!==false)
			return (<DeviceElectrical id={this.state.editing} device_type={this.state.device_type} onClose={this.close} />);

		if(this.state.creating)
			return this.renderDeviceType();

		return (
			<div className="sc-devices">
				<div className="actions">
					<i className="scf scf-plus" onClick={ () => this.setState({creating: true}) }></i>
				</div>
				<div className="list">
					{this.renderDevices()}
				</div>
			</div>
		);
	}
}
