import {Meter} from '../websocket/Meter.js';
import {KWh} from '../ui/KWh.js';
import {KW} from '../ui/KW.js';
import {SOC} from '../ui/SOC.js';
import {Tooltip} from '../ui/Tooltip.js';
import {API} from '../websocket/API.js';
import {Device as ProtocolDevice} from '../websocket/Device.js';
import {Config} from '../websocket/Config.js';

export class Summary extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			hws_min: 0,
			absence: false,
			limits: {},
			devices: [],
		}

		this.ref = React.createRef();

		this.update = this.update.bind(this);
		this.reload = this.reload.bind(this);
		this.reloadConfig = this.reloadConfig.bind(this);
	}

	async componentDidMount() {
		this.meter = new Meter(this.update);

		Config.instance.Subscribe(this.reloadConfig);

		let limits = await API.instance.command('storage', 'get', {name: 'limits'});
		if(limits===null)
			limits = {};

		this.setState({limits: limits});

		ProtocolDevice.instance.Subscribe('electrical', 0, this.reload);
	}

	componentWillUnmount() {
		this.meter.disconnect();

		Config.instance.Unsubscribe(this.reloadConfig);
		ProtocolDevice.instance.Unsubscribe('electrical', 0, this.reload);
	}

	reloadConfig(config) {
		this.setState({
			hws_min: config.energy.GetEnergy("energy.hws.min"),
			absence: config.control.GetBool("control.absence.enabled")
		});
	}

	update(data) {
		this.setState(data);
	}

	reload(devices) {
		this.setState({devices: devices});
	}

	getGridPrct() {
		if(!this.state.limits.grid)
			return 0;

		return parseFloat(this.state.grid) / parseFloat(this.state.limits.grid) * 100;
	}

	getPVPrct() {
		if(!this.state.limits.pv)
			return 0;

		return parseFloat(this.state.pv) / parseFloat(this.state.limits.pv) * 100;
	}

	getBatteryPrct() {
		if(!this.state.limits.battery)
			return 0;

		return parseFloat(this.state.battery) / parseFloat(this.state.limits.battery) * 100;
	}

	renderLeaf() {
		if(!this.state.offpeak)
			return;

		return (<i className="scf scf-leaf" />);
	}

	calcLinearGradient(prct, angle, color = '51,201,85,1') {
		if(prct<1)
			return {};

		if(prct>100)
			prct = 100;

		return {background: `linear-gradient(${angle}deg, rgba(${color}) 0%, rgba(${color}) ${prct}%, rgba(255,255,255,1) ${prct + 2}%, rgba(255,255,255,1) 100%)`};
	}

	calcLinearGradient2(prct1, prct2, angle) {
		if(prct1 + prct2<1)
			return {};

		return {background: `linear-gradient(${angle}deg, rgba(247,8,8,1) 0%, rgba(247,8,8,1) ${prct1}%, rgba(51,201,85,1) ${prct1}%, rgba(51,201,85,1) ${prct1 + prct2}%, rgba(255,255,255,1) ${prct1 + prct2}%, rgba(255,255,255,1) 100%)`};
	}

	calcPowerMix() {
		let prct = 100;
		let battery = this.state.battery==-1?0:this.state.battery;
		if(this.state.grid>0)
			prct = (this.state.pv + battery) / (this.state.pv + this.state.grid + battery) * 100;
		return prct;
	}

	getPVRatio() {
		let pv_consumed = this.state.pv_energy - this.state.grid_exported_energy + this.state.battery_energy;

		if(pv_consumed + this.state.grid_energy == 0)
			return 0;

		return pv_consumed / (this.state.grid_energy + pv_consumed) * 100;
	}

	calcEnergyMixStyle() {
		let prct = this.getPVRatio();
		return this.calcLinearGradient(prct, 90);
	}

	renderTopDevice() {
		let devices = this.state.devices;

		// Find most consuming device
		let max = -1, max_device = null;
		for(const device of devices)
		{
			if(device.power && device.power>max)
			{
				max = device.power;
				max_device = device;
			}
		}

		if(max_device===null)
			return;

		let name = max_device.device_name;
		if(name.length>20)
			name = name.substr(0, 20) + '...';

		return (
			<div className="line">
				<i className="scf scf-bolt" />
				<span>
					<KW value={max_device.power} />
				</span>
				<span className="label">
					{name}
				</span>
			</div>
		);
	}

	renderBattery() {
		if(!this.state.has_battery)
			return;

		return (
			<div className="line">
				<i className="scf scf-battery" />
				<span>
					<KW value={this.state.battery} />
				</span>
				<span className="energy">
					<KWh value={this.state.battery_energy} />
				</span>
			</div>
		);
	}

	render() {
		return (
			<div className="sc-meter-summary">
				<div className="line">
					<i className="scf scf-electricity" />
					<span>
						<KW value={this.state.grid} />&#160;{this.renderLeaf()}
					</span>
					<span className="energy">
						<KWh value={this.state.grid_energy} />
					</span>
				</div>

				<div className="line">
					<i className="scf scf-sun" />
					<span>
						<KW value={this.state.pv} />
					</span>
					<span className="energy">
						<KWh value={this.state.pv_energy} />
					</span>
				</div>

				{this.renderBattery()}

				<div className="line">
					<i className="scf scf-house" />
					<span>
						<KW value={this.state.total} />
					</span>
					<span>
						{this.calcPowerMix().toFixed(0)} % PV
					</span>
				</div>

				<div className="line">
					<i className="scf scf-droplet" />
					<span>
						<KW value={this.state.hws} />
					</span>
					<span className="energy">
						<KWh value={this.state.hws_energy} />
					</span>
				</div>

				{this.renderTopDevice()}

				<div className="home" style={this.calcEnergyMixStyle()}>
					<span><span>{this.getPVRatio().toFixed(0) + '% PV'}</span></span>
					<i className="scf scf-house" />
					<span className="energy"><KWh value={this.state.grid_energy + this.state.pv_energy + this.state.battery_energy - this.state.grid_exported_energy} /></span>
				</div>
			</div>
		);
	}
}
