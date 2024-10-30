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
		API.instance.command('deviceonoff', 'gethws', {device_id: parseInt(this.props.id)}).then(devicehws => {
			this.setState({devicehws: devicehws});
		});
	}

	render() {
		if(this.state.devicehws===null)
			return;

		return (
			<div>
				<table style={{width: '100%'}}>
					<tr>
						<td style={{textAlign: 'left'}}>State</td>
						<td style={{textAlign: 'right'}} className={this.state.devicehws.state?'off':'on'}><b>{this.state.devicehws.state?'Forced':'Solar offload'}</b></td>
					</tr>
				</table>
				<DeviceOnOff id={this.state.devicehws.device_id} />
			</div>
		);
	}
}
