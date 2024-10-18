import {API} from '../websocket/API.js';

export class DevicesHT extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			devices: [],
		};
	}

	componentDidMount() {
		this.reload();
	}

	reload() {
		API.instance.command('deviceht', 'list').then(devices => {
			this.setState({devices: devices});
		});
	}

	renderDevices() {
		return this.state.devices.map(device => {
			return (
				<tr key={device.device_id}>
					<td>{device.device_name}</td>
					<td style={{textAlign: 'center'}}>{device.temperature} °C</td>
					<td style={{textAlign: 'center'}}>{device.humidity} %</td>
				</tr>
			);
		});
	}

	render() {
		return (
			<div className="sc-devices">
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th style={{textAlign: 'center'}}>Temperature</th>
							<th style={{textAlign: 'center'}}>Humidity</th>
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
