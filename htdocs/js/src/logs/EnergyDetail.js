import {API} from '../websocket/API.js';
import {DateOnly} from '../ui/DateOnly.js';
import {KWh} from '../ui/KWh.js';
import {KW} from '../ui/KW.js';
import {Percent} from '../ui/Percent.js';
import {Loader} from '../ui/Loader.js';
import {NormalizeEnergyLog, ReduceEnergyLog} from './EnergyLog.js';

export class EnergyDetail extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			energy: {},
			filter: false,
		};

		this.filterDayNight = this.filterDayNight.bind(this);
	}

	componentDidMount() {
		this.reload();
	}

	reload() {
		API.instance.command('logs', 'energydetail', {day: this.props.day}).then(energy => {
			energy = NormalizeEnergyLog(energy);
			this.setState({energy: energy, loading: false});
		});
	}

	filterDayNight(devices) {
		if(this.state.filter===false)
			return true;

		if(this.state.filter=='day')
			return (devices.pv.production.energy > 0);

		return (devices.pv.production.energy == 0);
	}

	renderDailySummary() {
		let summary = ReduceEnergyLog(this.state.energy, this.filterDayNight);

		return (
			<div>
				<div className="date"><DateOnly value={this.props.day} /> summary
					&#160;
					<i className={"scf scf-sun-moon" + (this.state.filter===false?' on':'')} onClick={ () => this.setState({filter: false}) } />
					&#160;&#160;
					<i className={"scf scf-sun" + (this.state.filter==='day'?' on':'')} onClick={ () => this.setState({filter: 'day'}) } />
					&#160;&#160;&#160;
					<i className={"scf scf-moon" + (this.state.filter==='night'?' on':'')} onClick={ () => this.setState({filter: 'night'}) } />
				</div>
				<table>
					<tbody>
						{this.renderDevices(summary, true)}
					</tbody>
				</table>
			</div>
		);
	}

	renderDays() {
		return Object.keys(this.state.energy).sort().reverse().map(date => {
			const devices = this.state.energy[date];

			if(!this.filterDayNight(devices))
				return;

			return (
				<div key={date}>
					<div className="date">{date.substr(0, 16)}</div>
					<table>
						<tbody>
							{this.renderDevices(devices)}
						</tbody>
					</table>
				</div>
			);
		});
	}

	computePrct(energy, device_name) {
		let grid = energy.grid.consumption.energy;
		let pv = energy.pv.consumption.energy;

		let device_pv = 0;
		if(energy[device_name].offload!==undefined)
			device_pv = energy[device_name].offload.energy; // Device
		else if(energy[device_name].production!==undefined)
			device_pv = energy[device_name].production.energy; // PV or Battery

		let device_grid = 0;
		if(energy[device_name].consumption!==undefined)
			device_grid = energy[device_name].consumption.energy - device_pv;

		let global_prct = 0;
		global_prct = (device_grid + device_pv) / (grid + pv);
		let global_prct_pv = (device_pv + device_grid > 0)?device_pv / (device_pv + device_grid) * 100:0;
		let global_prct_grid = 100 - global_prct_pv;
		let mark1 = global_prct_pv * global_prct;
		let mark2 = mark1 + (global_prct_grid * global_prct);
		let linear_grad = 'linear-gradient(90deg, ';
		linear_grad += `#d7f5df 0%, #d7f5df ${mark1}%, `;
		linear_grad += `#f7dfda ${mark1}%, #f7dfda ${mark2}%, `;
		linear_grad += `#FFFFFF ${mark2}%, #FFFFFF 100%)`;
		return {prct: parseInt(global_prct * 100), grad: linear_grad};
	}

	renderDevices(devices, nopower = false) {
		let devices_names = Object.keys(devices);
		devices_names.sort((a, b) => {
			a = a.toLowerCase()
			b = b.toLowerCase();

			if(a=='grid' || a=='pv' || a=='battery')
				return 1;

			if(b=='grid' || b=='pv' || b=='battery')
				return -1;

			if(a==b)
				return 0;
			return a<b?-1:1;
		});

		return devices_names.map(device_name => {
			const data = devices[device_name];

			let prct = this.computePrct(devices, device_name);
			let val = data.consumption!==undefined?data.consumption.energy:data.production.energy;

			if(device_name=='hws')
				device_name = 'HWS';
			else if(device_name=='grid')
				device_name = 'Grid';
			else if(device_name=='pv')
				device_name = 'PV';
			else if(device_name=='battery')
				device_name = 'Battery';

			return (
				<tr key={device_name} style={{background: prct.grad}}>
					<td>{device_name}</td>
					<td>{nopower?(prct.prct + '%'):(<KW value={val * 4} />)}</td>
					<td><KWh value={val} /></td>
				</tr>
			);
		});
	}

	render() {
		if(this.state.loading)
			return (<Loader />);

		return (
			<div className="sc-logsenergydetail">
				{this.renderDailySummary()}
				{this.renderDays()}
			</div>
		);
	}
}
