import {Device as ProtocolDevice} from '../websocket/Device.js';
import {API} from '../websocket/API.js';
import {DeviceHT} from './DeviceHT.js';
import {HT as LogsHT} from '../logs/HT.js';
import {Modal} from '../ui/Modal.js';

export class DevicesHT extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			devices: [],
			editing: false,
			graph_type: false,
			graph_id: false,
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

	renderGraph() {
		if(this.state.graph_type===false || this.state.graph_id===false)
			return;

		return (
			<Modal title={this.renderModalTitle()} onClose={ () => this.setState({graph_type: false, graph_id: false}) }>
				<LogsHT key={this.state.graph_id + this.state.graph_type} type={this.state.graph_type} id={this.state.graph_id} />
			</Modal>
		);
	}

	renderModalTitle() {
		return (
			<React.Fragment>
				<i className="fa fa-temperature-half" onClick={ () => this.setState({graph_type: 't'}) }/>
				&#160;
				&#160;
				<i className="fa fa-regular fa-droplet-percent" onClick={ () => this.setState({graph_type: 'h'}) } />
			</React.Fragment>
		);
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
						<i className="fa fa-chart-line" onClick={ () => this.setState({graph_type: 't', graph_id: device.device_id}) } />
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
				{this.renderGraph()}
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
