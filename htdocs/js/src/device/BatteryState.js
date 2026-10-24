import {App} from '../app/App.js';
import {API} from '../websocket/API.js';
import {Device} from '../websocket/Device.js';
import {SOC} from '../ui/SOC.js';
import {KW} from '../ui/KW.js';
import {Time} from '../ui/Time.js';

export class BatteryState extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			devicebattery: null,
			devices: [],
		};

		this.reload_battery = this.reload_battery.bind(this);
		this.reload_devices = this.reload_devices.bind(this);
	}

	componentDidMount() {
		Device.instance.Subscribe('electrical', 'battery', this.reload_battery);
		Device.instance.Subscribe('electrical', 0, this.reload_devices);
	}

	componentWillUnmount() {
		Device.instance.Unsubscribe('electrical', 'battery', this.reload_battery);
		Device.instance.Unsubscribe('electrical', 0, this.reload_devices);
	}

	reload_battery(devicebattery) {
		this.setState({devicebattery: devicebattery});
	}

	reload_devices(devices) {
		this.setState({devices: devices});
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

	renderBatteryDevices() {
		return this.state.devices.map(device => {
			if(device.on_battery===undefined || !device.on_battery)
				return;

			return (
				<div key={device.device_id}>{device.device_name}</div>
			);
		});
	}

	renderTemperature() {
		const battery = this.state.devicebattery;

		if(battery.temperature===null)
			return;

		return (
			<React.Fragment>
				<dt>Temperature</dt>
				<dd>{battery.temperature.toFixed(1)} °C</dd>
			</React.Fragment>
		);
	}

	renderEstimatedTime() {
		const battery = this.state.devicebattery;

		if(battery.estimated_time===null || battery.estimated_time===0)
			return;

		if(battery.estimated_time>=0)
		{
			return (
				<React.Fragment>
					<dt>Charging time</dt>
					<dd><Time value={battery.estimated_time} /></dd>
				</React.Fragment>
			);
		}

		return (
			<React.Fragment>
				<dt>Discharging time</dt>
				<dd><Time value={Math.abs(battery.estimated_time)} /></dd>
			</React.Fragment>
		);
	}

	renderOffloadState() {
		const battery = this.state.devicebattery;
		if(battery.device_config.offload===undefined)
			return;

		return (
			<React.Fragment>
				<dt>Offload State</dt>
				<dd>{battery.offload_state}</dd>
			</React.Fragment>
		);
	}

	renderChargeRequired() {
		const battery = this.state.devicebattery;
		if(battery.device_config.charge===undefined)
			return;

		return (
			<React.Fragment>
				<dt>Charge required</dt>
				<dd>{battery.charge_required?'Yes':'No'}</dd>
			</React.Fragment>
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
					{this.renderEstimatedTime()}
					{this.renderOffloadState()}
					{this.renderChargeRequired()}
					{this.renderTemperature()}
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
				<h2>Devices on battery</h2>
				{this.renderBatteryDevices()}
			</div>
		);
	}
}
