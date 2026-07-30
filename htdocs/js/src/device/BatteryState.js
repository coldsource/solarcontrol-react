import {App} from '../app/App.js';
import {API} from '../websocket/API.js';
import {Device} from '../websocket/Device.js';
import {SOC} from '../ui/SOC.js';
import {KW} from '../ui/KW.js';

export class BatteryState extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			devicebattery: null,
		};

		this.reload = this.reload.bind(this);
	}

	componentDidMount() {
		Device.instance.Subscribe('electrical', 'battery', this.reload);
	}

	componentWillUnmount() {
		Device.instance.Unsubscribe('electrical', 'battery', this.reload);
	}

	reload(devicebattery) {
		this.setState({devicebattery: devicebattery});
	}

	calcLinearGradient(prct, angle, color = '51,201,85,1') {
		if(prct<1)
			return {};

		if(prct>100)
			prct = 100;

		return {background: `linear-gradient(${angle}deg, rgba(${color}) 0%, rgba(${color}) ${prct}%, rgba(255,255,255,1) ${prct + 2}%, rgba(255,255,255,1) 100%)`};
	}

	renderSOC() {
		return (
			<div className="soc" style={this.calcLinearGradient(this.state.devicebattery.soc, 90)}>
				<SOC value={this.state.devicebattery.soc} />
			</div>
		);
	}

	render() {
		if(this.state.devicebattery===null)
			return;

		const battery = this.state.devicebattery;
		const power = Math.abs(this.state.devicebattery.voltage * this.state.devicebattery.current);

		return (
			<div className="sc-batterystate">
				{this.renderSOC()}
				<h2>Battery</h2>
				<dl>
					<dt>State</dt>
					<dd>{battery.state}</dd>
					<dt>Voltage</dt>
					<dd>{battery.voltage.toFixed(2)}&#160;V</dd>
					<dt>Current</dt>
					<dd>{Math.abs(battery.current).toFixed(1)}&#160;A</dd>
					<dt>Power</dt>
					<dd><KW value={power} /></dd>
					<dt>SOC State</dt>
					<dd>{battery.soc_state}</dd>
					<dt>Offload State</dt>
					<dd>{battery.offload_state}</dd>
				</dl>
				<h2>Inverter output</h2>
				<dl>
					<dt>Power</dt>
					<dd><KW value={battery.power} /></dd>
					<dt>Voltage</dt>
					<dd>{battery.output_voltage.toFixed(1)}&#160;V</dd>
					<dt>Frequency</dt>
					<dd>{battery.output_frequency.toFixed(1)}&#160;Hz</dd>
				</dl>
			</div>
		);
	}
}
