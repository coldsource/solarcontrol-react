import {Device as ProtocolDevice} from '../websocket/Device.js';
import {API} from '../websocket/API.js';
import {DeviceOnOff} from './DeviceOnOff.js';
import {ControlOnOff} from '../ui/ControlOnOff.js';
import {KW} from '../ui/KW.js';

export class DevicesOnOff extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			devices: [],
			editing: false,
		};

		this.interval = null;

		this.close = this.close.bind(this);
		this.reload = this.reload.bind(this);
	}

	componentDidMount() {
		ProtocolDevice.instance.Subscribe('onoff', 0, this.reload);
	}

	componentWillUnmount() {
		ProtocolDevice.instance.Unsubscribe('onoff', 0, this.reload);
	}

	reload(devices) {
		this.setState({devices: devices});
	}

	close() {
		this.setState({editing: false});
	}

	edit(id) {
		this.setState({editing: id});
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

	renderDevices() {
		return this.state.devices.map(device => {
			return (
				<div key={device.device_id}>
					<div>
						<i className={"fa " + ((device.manual)?'fa-hand':'fa-regular fa-sun-bright')} onClick={() => { if(device.manual) this.setManualState(device.device_id, "auto") }} />
					</div>
					<div>
						<span className="name" onClick={ () => this.edit(device.device_id) }>{device.device_name}</span>
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

	render() {
		if(this.state.editing!==false)
			return (<DeviceOnOff id={this.state.editing} onClose={this.close} />);

		return (
			<div className="sc-devices">
				<div className="actions">
					<i className="fa fa-plus" onClick={ () => this.edit(0) }></i>
				</div>
				<div className="list">
					{this.renderDevices()}
				</div>
			</div>
		);
	}
}
