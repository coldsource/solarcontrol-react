import {API} from '../websocket/API.js';
import {DeviceOnOff} from './DeviceOnOff.js';

export class DevicesOnOff extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			devices: [],
			editing: false
		};

		this.close = this.close.bind(this);
	}

	componentDidMount() {
		this.reload();
	}

	reload() {
		API.instance.command('deviceonoff', 'list').then(devices => {
			this.setState({devices: devices});
		});
	}

	close() {
		this.setState({editing: false});
		this.reload();
	}

	edit(id) {
		this.setState({editing: id});
	}

	setManualState(id, state) {
		API.instance.command('deviceonoff', 'setstate', {device_id: id, state: state}).then(devices => {
			this.reload();
		});
	}

	renderDevices() {
		return this.state.devices.map(device => {
			return (
				<tr key={device.device_id}>
					<td>{device.device_name}</td>
					<td className={device.state?'on':'off'} onClick={() => this.setManualState(device.device_id, device.state?"off":"on")}>{device.state?'On':'Off'}</td>
					<td onClick={() => { if(device.manual) this.setManualState(device.device_id, "auto") }}>{device.manual?'Manual':'Auto'}</td>
					<td><i className="fa fa-eye" onClick={ () => this.edit(device.device_id) }/></td>
				</tr>
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
							<th style={{width: "4rem"}}>State</th>
							<th style={{width: "7rem"}}>Mode</th>
							<th style={{width: "2rem"}}></th>
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
