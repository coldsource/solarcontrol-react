import {App} from '../app/App.js';
import {API} from '../websocket/API.js';
import {Device as ProtocolDevice} from '../websocket/Device.js';
import {DeviceElectrical} from './DeviceElectrical.js';
import {SOC} from '../ui/SOC.js';

export class DeviceBattery extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			devicebattery: null,
		};

		this.reload = this.reload.bind(this);
	}

	componentDidMount() {
		ProtocolDevice.instance.Subscribe('electrical', 'battery', this.reload);
	}

	componentWillUnmount() {
		ProtocolDevice.instance.Unsubscribe('electrical', 'battery', this.reload);
	}

	reload(devicebattery) {
		this.setState({devicebattery: devicebattery});
	}

	setManualState(state) {
		API.instance.command('deviceelectrical', 'setstate', {device_id: this.state.devicebattery.device_id, state: state});
	}

	renderStateType() {
		const device = this.state.devicebattery;

		if(device.manual)
			return (<i className="scf scf-hand" onClick={() => this.setManualState("auto")}></i>);

		return (<i className="scf scf-sun"></i>);
	}

	renderState() {
		return (
			<dl>
				<dt>State</dt>
				<dd>{this.state.devicebattery.state} {this.renderStateType()}</dd>
				<dt>Voltage</dt>
				<dd>{this.state.devicebattery.voltage.toFixed(2)}&#160;V</dd>
				<dt>SOC</dt>
				<dd><SOC value={this.state.devicebattery.soc} /></dd>
				<dt>SOC State</dt>
				<dd>{this.state.devicebattery.soc_state}</dd>
				<dt>Grid State</dt>
				<dd>{this.state.devicebattery.grid_state}</dd>
			</dl>
		);
	}

	render() {
		if(this.state.devicebattery===null)
			return;

		return (
			<div className="sc-devicebattery">
				<div className="header">
					{this.renderState()}
				</div>
				<DeviceElectrical id={this.props.id} parts={this.props.parts} />
			</div>
		);
	}
}
