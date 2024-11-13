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

		return (<span className="power">(<KW value={power} />)</span>);
	}

	renderDevices() {
		return this.state.devices.map(device => {
			return (
				<React.Fragment key={device.device_id}>
					<tr>
						<td>
							<span onClick={ () => this.edit(device.device_id) }>{device.device_name}</span>
							{this.renderPower(device.power)}
						</td>
						<td>
							<i className={"fa " + ((device.manual)?'fa-hand':'fa-wand-magic-sparkles')} onClick={() => { if(device.manual) this.setManualState(device.device_id, "auto") }} />
							&#160;
							<ControlOnOff device_id={device.device_id} state={device.state} />
						</td>
					</tr>
				</React.Fragment>
			);
		});
	}

	render() {
		if(this.state.editing!==false)
			return (<DeviceOnOff id={this.state.editing} onClose={this.close} />);

		return (
			<div className="sc-devices">
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th><i className="fa fa-plus" onClick={ () => this.edit(0) }></i></th>
						</tr>
					</thead>
					<tbody>
						{this.renderDevices()}
					</tbody>
				</table>
			</div>
		);
	}
}
