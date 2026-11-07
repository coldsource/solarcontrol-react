import {Meter} from '../websocket/Meter.js';
import {KWh} from '../ui/KWh.js';
import {KW} from '../ui/KW.js';
import {SOC} from '../ui/SOC.js';
import {Tooltip} from '../ui/Tooltip.js';
import {API} from '../websocket/API.js';
import {Device as ProtocolDevice} from '../websocket/Device.js';
import {Config} from '../websocket/Config.js';

export class Global extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			hws_min: 0,
			absence: false,
			limits: {},
			devices: [],
			grid_device: null,
			battery_device: null,
			hws_device: null
		}

		this.ref = React.createRef();

		this.update = this.update.bind(this);
		this.reload = this.reload.bind(this);
		this.reload_grid = this.reload_grid.bind(this);
		this.reload_battery = this.reload_battery.bind(this);
		this.reload_hws = this.reload_hws.bind(this);
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
		ProtocolDevice.instance.Subscribe('electrical', 'grid', this.reload_grid);
		ProtocolDevice.instance.Subscribe('electrical', 'battery', this.reload_battery);
		ProtocolDevice.instance.Subscribe('electrical', 'hws', this.reload_hws);
	}

	componentWillUnmount() {
		this.meter.disconnect();

		Config.instance.Unsubscribe(this.reloadConfig);
		ProtocolDevice.instance.Unsubscribe('electrical', 0, this.reload);
		ProtocolDevice.instance.Unsubscribe('electrical', 'grid', this.reload_grid);
		ProtocolDevice.instance.Unsubscribe('electrical', 'battery', this.reload_battery);
		ProtocolDevice.instance.Unsubscribe('electrical', 'hws', this.reload_hws);
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

	reload_grid(grid_device) {
		this.setState({grid_device: grid_device});
	}

	reload_battery(battery_device) {
		this.setState({battery_device: battery_device});
	}

	reload_hws(hws_device) {
		this.setState({hws_device: hws_device});
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

	calcPowerMixStyle() {
		let prct = 100;
		let battery = this.state.battery==-1?0:this.state.battery;
		if(this.state.grid>0)
			prct = (this.state.pv + battery) / (this.state.pv + this.state.grid + battery) * 100;
		return this.calcLinearGradient(prct, 0);
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

	calcHWSMixStyle() {
		if(this.state.hws_min==0)
			return {};

		if(this.state.hws_energy===undefined)
			return {};

		let hws_energy = this.state.hws_energy;
		let hws_min = this.state.hws_min;
		let hws_energy_offload = this.state.hws_energy_offload;
		let hws_energy_grid = hws_energy - hws_energy_offload;

		let hws_fill_prct = hws_energy / hws_min;
		if(hws_fill_prct>=1)
			hws_fill_prct = 1;

		let prct_forced = hws_energy_grid / hws_energy * hws_fill_prct * 100;
		let prct_offload = hws_energy_offload / hws_energy * hws_fill_prct * 100;
		return this.calcLinearGradient2(prct_forced, prct_offload, 0);
	}

	renderTopDevice() {
		let devices = this.state.devices;

		// Find most consuming device
		let max = -1, max_device = null;
		for(const device of devices)
		{
			if(device.device_type=='battery')
				continue; // Exclude batteries as they produce energy

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
			<div>
				<div className="label">{name}</div>
				<div>
					<div className="network-vert">
						<img className="arrow-down" src="/images/arrow-down.svg" />
						<Tooltip content="Instant power of most consuming device">
							<span className="meter"><KW value={max_device.power} /></span>
						</Tooltip>
					</div>
					<div className="round">
						<div><i className="scf scf-bolt" /></div>
					</div>
				</div>
			</div>
		);
	}

	renderAbsence() {
		if(!this.state.absence)
			return;

		return (<div className="on center"><b>Absence mode on</b></div>);
	}

	renderGrid() {
		return (
			<div className="icontray-right">
				<div className="round" style={this.calcLinearGradient(this.getGridPrct(), 0, '245, 130, 29')}>
					{this.renderGridStatus()}
					<Tooltip content="Total energy consumed today from the grid in Wh or kWh">
						<span className="meter top energy"><KWh value={this.state.grid_energy} /></span>
					</Tooltip>
				</div>
				<div className="icontray">{this.renderGridIcons()}</div>
			</div>
		);
	}

	renderGridStatus() {
		if(this.state.grid_device!==null && this.state.grid_device.grid_state=='offline')
			return (<div className="offline">Offline</div>);


		return (
			<div>
				<Tooltip content="Grid power supply. Will fill with orange color depending on your current consumption if you setup «&#160;Limits&#160;» in settings">
					<i className="scf scf-electricity" />
				</Tooltip>
			</div>
		);
	}

	renderGridIcons() {
		if(this.state.grid_device===null)
			return; // Grid not yet loaded

		let ret = [];

		if(this.state.offpeak)
			ret.push((<i className="scf scf-leaf" key="offpeak"/>));

		return ret;
	}

	renderBattery() {
		if(!this.state.has_battery)
			return (<div></div>);

		return (
			<div className="icontray-both">
				<div className="icontray">{this.renderBatteryIcons('left')}</div>
				<div className="round" style={this.calcLinearGradient(this.getBatteryPrct(), 0)}>

					<div><i className="scf scf-battery" /></div>
					<div className="soc">
						<Tooltip content="Battery power supply. Will fill with green color depending on your current injection if you setup «&#160;Limits&#160;» in settings">
							<SOC value={this.state.battery_soc} />
						</Tooltip>
					</div>
					<Tooltip content="Total energy injected by battery in Wh or kWh">
						<span className="meter top energy"><KWh value={this.state.battery_energy} /></span>
					</Tooltip>
				</div>
				<div className="icontray">{this.renderBatteryIcons('right')}</div>
			</div>
		);
	}

	renderBatteryIcons(side) {
		if(this.state.battery_device===null)
			return; // Battery not yet loaded

		let ret = [];

		if(side=='right')
		{
			if(this.state.battery_device.manual)
				ret.push((<i className="scf scf-hand" key="manual"/>));

			if(this.state.battery_device.soc_state == 'charging')
				ret.push((<i className="scf scf-bolt" key="charging" />));
		}
		else
		{
			if(this.state.battery_device.temperature!==undefined && this.state.limits.battery_low_temp!==undefined && this.state.battery_device.temperature < this.state.limits.battery_low_temp)
				ret.push((<i className="scf scf-snow" key="frost" />));
		}

		return ret;
	}

	renderBatteryConnector() {
		if(!this.state.has_battery)
			return;

		return (
			<div className="network-vert">
				<img className="arrow-down" src="/images/arrow-down.svg" />
				<Tooltip content="Instant power injected by battery">
					<span className="meter"><KW value={this.state.battery} /></span>
				</Tooltip>
			</div>
		);
	}

	renderPV() {
		return (
			<div className="icontray-left">
				<div className="icontray"></div>
				<div className="round" style={this.calcLinearGradient(this.getPVPrct(), 0)}>
					<div>
						<Tooltip content="PV power supply. Will fill with green color depending on your current production if you setup «&#160;Limits&#160;» in settings">
							<i className="scf scf-sun" />
						</Tooltip>
					</div>
					<Tooltip content="Total energy produced today by PV in Wh or kWh">
						<span className="meter top energy"><KWh value={this.state.pv_energy} /></span>
					</Tooltip>
				</div>
			</div>
		);
	}

	renderHWS() {
		return (
			<div className="icontray-right">
				<div className="round" style={this.calcHWSMixStyle()}>
					<div><i className="scf scf-droplet" /></div>
					<Tooltip content="Total energy taken by HWS for today">
						<span className="meter bottom energy"><KWh value={this.state.hws_energy} /></span>
					</Tooltip>
				</div>
				<div className="icontray">{this.renderHWSIcons()}</div>
			</div>
		);
	}

	renderHWSIcons() {
		if(this.state.hws_device===null)
			return;

		let ret = [];

		if(this.state.hws_device.manual)
			ret.push((<i className="scf scf-hand" key="manual"/>));

		if(this.state.hws_device.state)
			ret.push((<i className="scf scf-bolt" key="charging"/>));

		return ret;
	}

	render() {
		return (
			<div className="sc-meter-global">
				{this.renderAbsence()}
				<div className="production">
					{this.renderGrid()}
					{this.renderBattery()}
					{this.renderPV()}
				</div>
				<div className="network">
					<div className="connector-grid">
						{this.state.grid<0?(<img className="arrow-grid" src="/images/arrow-up.svg" />):''}
						{this.state.grid>=0?(<img className="arrow-bolt" src="/images/arrow-right.svg" />):''}
						<Tooltip content="Instant power currently taken from or sent back to the grid">
							<span className="meter gridpv"><KW value={this.state.grid} /></span>
						</Tooltip>
					</div>
					<div className="mix">
						{this.renderBatteryConnector()}
						<div className="round bolt" style={this.calcPowerMixStyle()}>
							<div><i className="scf scf-bolt" /></div>
						</div>
					</div>
					<div className="connector-pv">
						<img className="arrow-bolt" src="/images/arrow-left.svg" />
						<Tooltip content="Instant power currently produced by PV">
							<span className="meter gridpv"><KW value={this.state.pv} /></span>
						</Tooltip>
					</div>
				</div>
				<div className="network-vert">
					<img className="arrow-down" src="/images/arrow-down.svg" />
					<Tooltip content="Instant power currently consumed by the house">
						<span className="meter"><KW value={this.state.total} /></span>
					</Tooltip>
				</div>
				<div className="home" style={this.calcEnergyMixStyle()}>
					<Tooltip content="Percent of energy consumed from PV for the day">
						<span><span>{this.getPVRatio().toFixed(0) + '% PV'}</span></span>
					</Tooltip>
					<i className="scf scf-house" />
					<Tooltip content="Total amount of energy consumed for the day (PV + Grid, ignoring export)">
						<span className="energy"><KWh value={this.state.grid_energy + this.state.pv_energy + this.state.battery_energy - this.state.grid_exported_energy} /></span>
					</Tooltip>
				</div>
				<div className="home-devices">
					<div>
						<div>
							<div className="network-vert">
								<img className="arrow-down" src="/images/arrow-down.svg" />
								<Tooltip content="Instant power HWS">
									<span className="meter"><KW value={this.state.hws} /></span>
								</Tooltip>
							</div>
							{this.renderHWS()}
						</div>
					</div>
					<div>
						<div className="label">Available power</div>
						<div>
							<div className="network-vert">
								<img className="arrow-down" src="/images/arrow-down.svg" />
								<Tooltip content="Instant power available after filling HWS">
									<span className="meter"><KW value={this.state.net_available} /></span>
								</Tooltip>
							</div>
							<div className="round">
								<div><i className="scf scf-available-energy" /></div>
							</div>
						</div>
					</div>
					{this.renderTopDevice()}
				</div>
			</div>
		);
	}
}
