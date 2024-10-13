import {API} from '../websocket/API.js';
import {Device} from './Device.js';

export class Devices extends React.Component
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
		API.instance.command('device', 'list').then(devices => {
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

	renderDevices() {
		return this.state.devices.map(device => {
			return (
				<tr key={device.device_id}>
					<td>{device.device_name}</td>
					<td>{device.device_prio}</td>
					<td><i className="fa fa-eye" onClick={ () => this.edit(device.device_id) }/></td>
				</tr>
			);
		});
	}

	render() {
		if(this.state.editing!==false)
			return (<Device id={this.state.editing} onClose={this.close} />);
		return (
			<div className="sc-devices">
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Priority</th>
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
