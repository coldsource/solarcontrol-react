import {App} from '../app/App.js';
import {API} from '../websocket/API.js';
import {DeviceOnOff} from './DeviceOnOff.js';


export class DeviceHWS extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			devicehws: null,
		};
	}

	componentDidMount() {
		this.reload();
	}

	reload() {
		API.instance.command('deviceonoff', 'gethws', {device_id: parseInt(this.props.id)}).then(devicehws => {
			this.setState({devicehws: devicehws});
		});
	}

	setManualState(state) {
		API.instance.command('deviceonoff', 'setstate', {device_id: this.state.devicehws.device_id, state: state}).then(devices => {
			this.reload();
		});
	}

	renderStateType() {
		const device = this.state.devicehws;

		if(device.manual)
			return (<span onClick={() => this.setManualState("auto")}>Manual</span>);

		return (<span>Auto</span>);
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
				<br />
				<DeviceOnOff id={this.state.devicehws.device_id} />
			</div>
		);
	}
}
