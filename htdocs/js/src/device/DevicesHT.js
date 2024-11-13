import {Device as ProtocolDevice} from '../websocket/Device.js';
import {API} from '../websocket/API.js';
import {DeviceHT} from './DeviceHT.js';

export class DevicesHT extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			devices: [],
			editing: false,
		};

		this.close = this.close.bind(this);
		this.reload = this.reload.bind(this);
	}

	componentDidMount() {
		ProtocolDevice.instance.Subscribe('ht', 0, this.reload);
	}

	componentWillUnmount() {
		ProtocolDevice.instance.Unsubscribe('ht', 0, this.reload);
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

	renderDevices() {
		return this.state.devices.map(device => {
			return (
				<tr key={device.device_id}>
					<td>{device.device_name}</td>
					<td style={{textAlign: 'center'}}>{device.temperature} °C</td>
					<td style={{textAlign: 'center'}}>{device.humidity} %</td>
					<td style={{textAlign: 'center'}}><i className="fa fa-cogs" onClick={ () => this.edit(device.device_id) } /></td>
				</tr>
			);
		});
	}

	render() {
		if(this.state.editing!==false)
			return (<DeviceHT id={this.state.editing} onClose={this.close} />);

		return (
			<div className="sc-devices">
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th style={{textAlign: 'center'}}>Temperature</th>
							<th style={{textAlign: 'center'}}>Humidity</th>
							<th><i className="fa fa-plus" onClick={ () => this.edit(0) } /></th>
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
