import {API} from '../websocket/API.js';
import {DeviceOnOff} from './DeviceOnOff.js';

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
	}

	componentDidMount() {
		this.reload();

		this.startAutoRefresh();
	}

	componentWillUnmount() {
		this.stopAutoRefresh();
	}

	startAutoRefresh() {
		this.interval = setInterval(() => this.reload(), 2000);
	}

	stopAutoRefresh() {
		if(this.interval===null)
			return;

		clearInterval(this.interval);
		this.interval = null;
	}

	reload() {
		API.instance.command('deviceonoff', 'list').then(devices => {
			this.setState({devices: devices});
		});
	}

	close() {
		this.startAutoRefresh();
		this.setState({editing: false});
		this.reload();
	}

	edit(id) {
		this.stopAutoRefresh();
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
					<td style={{textAlign: 'center'}}><i className="fa fa-cogs" onClick={ () => this.edit(device.device_id) } /></td>
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
							<th style={{width: "2rem", textAlign: 'center'}}><i className="fa fa-plus" onClick={ () => this.edit(0) }></i></th>
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
