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
				<div key={device.device_id}>
					<div>
						<i className="fa fa-regular fa-droplet-degree" />
					</div>
					<div>
						<span className="name" onClick={ () => this.edit(device.device_id) }>
							{device.device_name}
						</span>
						<div className="ht">
							<i className="fa fa-temperature-half" /> {device.temperature} °C
							&#160;&#160;
							<i className="fa fa-regular fa-droplet" /> {device.humidity} %
						</div>
					</div>
					<div>
					</div>
				</div>
			);
		});
	}

	render() {
		if(this.state.editing!==false)
			return (<DeviceHT id={this.state.editing} onClose={this.close} />);

		return (
			<div className="sc-devices">
				<div className="actions">
					<i className="fa fa-plus" onClick={ () => this.edit(0) } />
				</div>
				<div className="list">
					{this.renderDevices()}
				</div>
			</div>
		);
	}
}
