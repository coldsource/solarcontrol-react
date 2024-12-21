import {App} from '../app/App.js';
import {API} from '../websocket/API.js';
import {Device as ProtocolDevice} from '../websocket/Device.js';
import {DeviceOnOff} from './DeviceOnOff.js';


export class DeviceHWS extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			devicehws: null,
		};

		this.reload = this.reload.bind(this);
	}

	componentDidMount() {
		ProtocolDevice.instance.Subscribe('onoff', 'hws', this.reload);
	}

	componentWillUnmount() {
		ProtocolDevice.instance.Unsubscribe('onoff', 'hws', this.reload);
	}

	reload(devicehws) {
		this.setState({devicehws: devicehws});
	}

	setManualState(state) {
		API.instance.command('deviceonoff', 'setstate', {device_id: this.state.devicehws.device_id, state: state});
	}

	renderStateType() {
		const device = this.state.devicehws;

		if(device.manual)
			return (<i className="scf scf-hand" onClick={() => this.setManualState("auto")}></i>);

		return (<i className="scf scf-sun"></i>);
	}

	renderState() {
		const device = this.state.devicehws;

		return (
			<span
				className={this.state.devicehws.state?'off':'on'}
				onClick={() => this.setManualState(device.state?"off":"on")}
			>
				<b>{this.state.devicehws.state?'Forced':'Solar offload'}</b>
			</span>
		);
	}

	render() {
		if(this.state.devicehws===null)
			return;

		return (
			<div className="sc-devicehws">
				<table className="header">
					<tbody>
						<tr>
							<td style={{textAlign: 'left'}}>{this.renderStateType()}</td>
							<td style={{textAlign: 'right'}}>{this.renderState()}</td>
						</tr>
					</tbody>
				</table>
				<DeviceOnOff id={this.state.devicehws.device_id} />
			</div>
		);
	}
}
