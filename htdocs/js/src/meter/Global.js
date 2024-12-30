import {Meter} from '../websocket/Meter.js';
import {KWh} from '../ui/KWh.js';
import {KW} from '../ui/KW.js';

export class Global extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
		}

		this.ref = React.createRef();

		this.update = this.update.bind(this);
	}

	componentDidMount() {
		this.meter = new Meter(this.update);
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

	calcPowerMixStyle() {
		let prct = 100;
		if(this.state.grid>0)
			prct = this.state.pv / (this.state.pv + this.state.grid) * 100;
		return this.calcLinearGradient(prct, 0);
	}

	getPVRatio() {
		let pv_consumed = this.state.pv_energy - this.state.grid_exported_energy;
		return pv_consumed / (this.state.grid_energy + pv_consumed) * 100;
	}

	calcEnergyMixStyle() {
		let prct = this.getPVRatio();
		return this.calcLinearGradient(prct, 90);
	}

	render() {
		return (
			<div className="sc-meter-global">
				<div className="production">
					<div className="round">
						<div><i className="scf scf-electricity" /></div>
						<span className="meter right"><KWh value={this.state.grid_energy} /></span>
					</div>
					<div></div>
					<div className="round">
						<div><i className="scf scf-sun" /></div>
						<span className="meter left"><KWh value={this.state.pv_energy} /></span>
					</div>
				</div>
				<div className="network">
					<div className="connector-grid">
						{this.state.grid<0?(<img className="arrow-grid" src="/images/arrow-up.svg" />):''}
						{this.state.grid>=0?(<img className="arrow-bolt" src="/images/arrow-right.svg" />):''}
						<span className="meter"><KW value={this.state.grid} /></span>
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
					<span><KW value={this.state.grid_energy + this.state.pv_energy - this.state.grid_exported_energy} /></span>
					<i className="scf scf-house" />
					<span>{this.getPVRatio().toFixed(0) + '% PV'}</span>
				</div>
				<div className="home-devices">
					<div></div>
					<div>
						<div className="network-vert">
							<img className="arrow-down" src="/images/arrow-down.svg" />
							<span className="meter"><KW value={this.state.hws} /></span>
						</div>
						<div className="round">
							<div><i className="scf scf-droplet" /></div>
							<span className="meter bottom"><KWh value={this.state.hws_energy} /></span>
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
