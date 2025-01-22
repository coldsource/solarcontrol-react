import {Meter} from '../websocket/Meter.js';
import {KWh} from '../ui/KWh.js';
import {KW} from '../ui/KW.js';
import {API} from '../websocket/API.js';

export class Global extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			hws_min: 0,
		}

		this.ref = React.createRef();

		this.update = this.update.bind(this);
	}

	componentDidMount() {
		this.meter = new Meter(this.update);

		 API.instance.command('config', 'get', {module: 'energy'}).then(config => {
			 let hws_min = config.config["energy.hws.min"];
			 if(hws_min.substr(-3)=='kwh' || hws_min.substr(-3)=='kWh')
				 hws_min = hws_min.substr(0, hws_min.length-3) * 1000;
			 else if(hws_min.substr(-2)=='wh' || hws_min.substr(-2)=='Wh')
				 hws_min = hws_min.substr(0, hws_min.length-2);
			 this.setState({hws_min: hws_min});
		 });
	}

	componentWillUnmount() {
		this.meter.disconnect();
	}

	update(data) {
		this.setState(data);
	}

	renderLeaf() {
		if(!this.state.offpeak)
			return;

		return (<i className="scf scf-leaf" />);
	}

	calcLinearGradient(prct, angle) {
		if(prct<1)
			return {};

		return {background: `linear-gradient(${angle}deg, rgba(51,201,85,1) 0%, rgba(51,201,85,1) ${prct}%, rgba(255,255,255,1) ${prct + 2}%, rgba(255,255,255,1) 100%)`};
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

	render() {
		return (
			<div className="sc-meter-global">
				<div className="production">
					<div className="round">
						<div><i className="scf scf-electricity" /></div>
						<span className="meter right energy"><KWh value={this.state.grid_energy} /></span>
					</div>
					<div></div>
					<div className="round">
						<div><i className="scf scf-sun" /></div>
						<span className="meter left energy"><KWh value={this.state.pv_energy} /></span>
					</div>
				</div>
				<div className="network">
					<div className="connector-grid">
						{this.state.grid<0?(<img className="arrow-grid" src="/images/arrow-up.svg" />):''}
						{this.state.grid>=0?(<img className="arrow-bolt" src="/images/arrow-right.svg" />):''}
						<span className="meter"><KW value={this.state.grid} />&#160;{this.renderLeaf()}</span>
					</div>
					<div className="round bolt" style={this.calcPowerMixStyle()}>
						<div><i className="scf scf-bolt" /></div>
					</div>
					<div className="connector-pv">
						<img className="arrow-bolt" src="/images/arrow-left.svg" />
						<span className="meter"><KW value={this.state.pv} /></span>
					</div>
				</div>
				<div className="network-vert">
					<img className="arrow-down" src="/images/arrow-down.svg" />
					<span className="meter"><KW value={this.state.total} /></span>
				</div>
				<div className="home" style={this.calcEnergyMixStyle()}>
					<span className="energy"><KWh value={this.state.grid_energy + this.state.pv_energy - this.state.grid_exported_energy} /></span>
					<i className="scf scf-house" />
					<span><span>{this.getPVRatio().toFixed(0) + '% PV'}</span></span>
				</div>
				<div className="home-devices">
					<div></div>
					<div>
						<div className="network-vert">
							<img className="arrow-down" src="/images/arrow-down.svg" />
							<span className="meter"><KW value={this.state.hws} /></span>
						</div>
						<div className="round" style={this.calcHWSMixStyle()}>
							<div><i className="scf scf-droplet" /></div>
							<span className="meter bottom energy"><KWh value={this.state.hws_energy} /></span>
						</div>
					</div>
					<div>
						<div className="network-vert">
							<img className="arrow-down" src="/images/arrow-down.svg" />
							<span className="meter"><KW value={this.state.net_available} /></span>
						</div>
						<div className="round">
							<div><i className="scf scf-available-energy" /></div>
						</div>
					</div>
					<div></div>
				</div>
			</div>
		);
	}
}
