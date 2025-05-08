import {Meter} from '../websocket/Meter.js';
import {KWh} from '../ui/KWh.js';
import {KW} from '../ui/KW.js';
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

	calcPowerMixStyle() {
		let prct = 100;
		if(this.state.grid>0)
			prct = this.state.pv / (this.state.pv + this.state.grid) * 100;
		return this.calcLinearGradient(prct, 0);
	}

	getPVRatio() {
		let pv_consumed = this.state.pv_energy - this.state.grid_exported_energy;

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

	render() {
		return (
			<div className="sc-meter-global">
				{this.renderAbsence()}
				<div className="production">
					<div className="round" style={this.calcLinearGradient(this.getGridPrct(), 0, '245, 130, 29')}>
						<div><i className="scf scf-electricity" /></div>
						<Tooltip content="Total energy consumed today from the grid in Wh or kWh">
							<span className="meter right energy"><KWh value={this.state.grid_energy} /></span>
						</Tooltip>
					</div>
					<div></div>
					<div className="round" style={this.calcLinearGradient(this.getPVPrct(), 0)}>
						<div><i className="scf scf-sun" /></div>
						<Tooltip content="Total energy produced today by PV in Wh or kWh">
							<span className="meter left energy"><KWh value={this.state.pv_energy} /></span>
						</Tooltip>
					</div>
				</div>
				<div className="network">
					<div className="connector-grid">
						{this.state.grid<0?(<img className="arrow-grid" src="/images/arrow-up.svg" />):''}
						{this.state.grid>=0?(<img className="arrow-bolt" src="/images/arrow-right.svg" />):''}
						<Tooltip content="Instant power currently taken from or sent back to the grid">
							<span className="meter"><KW value={this.state.grid} />&#160;{this.renderLeaf()}</span>
						</Tooltip>
					</div>
					<div className="round bolt" style={this.calcPowerMixStyle()}>
						<div><i className="scf scf-bolt" /></div>
					</div>
					<div className="connector-pv">
						<img className="arrow-bolt" src="/images/arrow-left.svg" />
						<Tooltip content="Instant power currently produced by PV">
							<span className="meter"><KW value={this.state.pv} /></span>
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
						<span className="energy"><KWh value={this.state.grid_energy + this.state.pv_energy - this.state.grid_exported_energy} /></span>
					</Tooltip>
				</div>
				<div className="home-devices">
					<div>
						<div>
							<div className="label">HWS</div>
							<div className="network-vert">
								<img className="arrow-down" src="/images/arrow-down.svg" />
								<Tooltip content="Instant power HWS">
									<span className="meter"><KW value={this.state.hws} /></span>
								</Tooltip>
							</div>
							<div className="round" style={this.calcHWSMixStyle()}>
								<div><i className="scf scf-droplet" /></div>
								<Tooltip content="Total energy taken by HWS for today">
									<span className="meter bottom energy"><KWh value={this.state.hws_energy} /></span>
								</Tooltip>
							</div>
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
