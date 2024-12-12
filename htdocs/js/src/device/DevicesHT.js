import {Device as ProtocolDevice} from '../websocket/Device.js';
import {API} from '../websocket/API.js';
import {SelectDeviceTypeHT} from '../ui/SelectDeviceTypeHT.js';
import {DeviceHT} from './DeviceHT.js';
import {HTGraph} from '../logs/HTGraph.js';
import {Modal} from '../ui/Modal.js';
import {Subscreen} from '../ui/Subscreen.js';

export class DevicesHT extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			devices: [],
			editing: false,
			creating: false,
			device_type: "",
			graph_type: false,
			graph_id: false,
			date: "",
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
		this.setState({editing: false, creating: false});
	}

	edit(id) {
		this.setState({editing: id});
	}

	renderGraph() {
		if(this.state.graph_type===false || this.state.graph_id===false)
			return;

		return (
			<Modal title={this.renderModalTitle()} onClose={ () => this.setState({graph_type: false, graph_id: false}) }>
				<HTGraph key={this.state.graph_id + this.state.graph_type + this.state.date} type={this.state.graph_type} id={this.state.graph_id} day={this.state.date} />
			</Modal>
		);
	}

	renderModalTitle() {
		return (
			<div className="httitle">
				<i className="fa fa-temperature-half" onClick={ () => this.setState({graph_type: 't'}) }/>
				<i className="fa fa-regular fa-droplet-percent" onClick={ () => this.setState({graph_type: 'h'}) } />
				<input type="date" value={this.state.date} onChange={ ev => this.setState({date: ev.target.value}) } />
			</div>
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

	renderDeviceType() {
		return (
			<Subscreen title="New device type" onClose={() => this.setState({creating: false})}>
				<SelectDeviceTypeHT name="editing_type" value="" onChange={ ev => this.setState({creating: false, editing: 0, device_type: ev.target.value}) } />
			</Subscreen>
		);
	}

	render() {
		if(this.state.editing!==false)
			return (<DeviceHT id={this.state.editing} device_type={this.state.device_type} onClose={this.close} />);

		if(this.state.creating)
			return this.renderDeviceType();

		return (
			<div className="sc-devices">
				{this.renderGraph()}
				<div className="actions">
					<i className="fa fa-plus" onClick={ () => this.setState({creating: true}) }></i>
				</div>
				<div className="list">
					{this.renderDevices()}
				</div>
			</div>
		);
	}
}
