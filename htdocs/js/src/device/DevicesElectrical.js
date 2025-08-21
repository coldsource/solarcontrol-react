import {Device as ProtocolDevice} from '../websocket/Device.js';
import {API} from '../websocket/API.js';
import {SelectDeviceType} from '../ui/SelectDeviceType.js';
import {DeviceElectrical} from './DeviceElectrical.js';
import {ControlOnOff} from '../ui/ControlOnOff.js';
import {KW} from '../ui/KW.js';
import {SOC} from '../ui/SOC.js';
import {Subscreen} from '../ui/Subscreen.js';
import {DragDropZone} from '../ui/DragDropZone.js';

export class DevicesElectrical extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			devices: [],
			editing: false,
			creating: false,
			prio: false,
			device_type: "",
		};

		this.interval = null;

		this.changeDeviceType = this.changeDeviceType.bind(this);
		this.changePrio = this.changePrio.bind(this);
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

	renderSOC(device) {
		if(device.device_type!='battery')
			return;

		return (
			<React.Fragment>
				<SOC value={device.soc} /> - {device.voltage.toFixed(2)}V
			</React.Fragment>
		);
	}

	getAllDevices() {
		let devices = [...this.state.devices];

		return devices.sort((dev1, dev2) => {
			if(dev1.device_name.toUpperCase()<dev2.device_name.toUpperCase())
				return -1;
			return 1;
		});
	}

	getOnOffDevices() {
		let devices = [...this.state.devices];

		devices = devices.filter(device => device.device_category==1);
		return devices.sort((dev1, dev2) => {
			if(dev1.device_config.prio<dev2.device_config.prio)
				return -1;
			return 1;
		});
	}

	renderDevices(mode = 'list') {
		let devices;

		if(mode=='list')
			devices = this.getAllDevices();
		else if(mode=='prio')
			devices = this.getOnOffDevices();

		return devices.map(device => {
			let cl_auto = 'scf-sun';
			if(device.device_type=='passive')
				cl_auto = 'scf-meter';
			else if(device.device_type=='battery')
				cl_auto = 'scf-battery';

			return (
				<div key={device.device_id} className="device">
					<div>
						<i className={"scf " + ((device.manual)?'scf-hand':cl_auto)} onClick={mode=='list'?(() => { if(device.manual) this.setManualState(device.device_id, "auto") }):(() => {})} />
					</div>
					<div>
						<span className="name" onClick={ mode=='list'?(() => this.edit(device.device_id)):(() => {}) }>{device.device_name}</span>
						<div className="power">
							{this.renderPower(device.power)}
							{this.renderSOC(device)}
						</div>
					</div>
					<div>
						{(device.device_type!='passive' && device.device_type!='battery')?(<ControlOnOff device_id={device.device_id} state={device.state} />):null}
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

	changePrio(ev) {
		let devices = this.getOnOffDevices();
		const moved_device = devices[ev.from];
		devices.splice(ev.from, 1);
		if(ev.from<ev.to)
			devices.splice(ev.to-1, 0, moved_device);
		else
			devices.splice(ev.to, 0, moved_device);

		let params = {};
		for(let i=0; i<devices.length; i++)
		{
			const device = devices[i];
			params[device.device_id] = i + 1;
		}

		API.instance.command('deviceelectrical', 'setprio', params);
	}

	render() {
		if(this.state.editing!==false)
			return (<DeviceElectrical id={this.state.editing} device_type={this.state.device_type} onClose={this.close} />);

		if(this.state.creating)
			return this.renderDeviceType();

		if(this.state.prio)
		{
			return (
				<div className="sc-devices">
					<div className="actions">
						<i className="scf scf-cross" onClick={ () => this.setState({prio: false}) }></i>
					</div>
					<div className="center">
						Set devices offload priority (first in the list is most prioritary)
					</div>
					<DragDropZone items={this.renderDevices('prio')} onChange={this.changePrio} />
				</div>
			);
		}

		return (
			<div className="sc-devices">
				<div className="actions">
					<i className="scf scf-priority" onClick={ () => this.setState({prio: true}) }></i>
					<i className="scf scf-plus" onClick={ () => this.setState({creating: true}) }></i>
				</div>
				<div className="list">
					{this.renderDevices()}
				</div>
			</div>
		);
	}
}
