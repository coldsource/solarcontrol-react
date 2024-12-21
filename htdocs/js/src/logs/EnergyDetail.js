import {API} from '../websocket/API.js';
import {DateOnly} from '../ui/DateOnly.js';
import {KWh} from '../ui/KWh.js';
import {KW} from '../ui/KW.js';
import {Percent} from '../ui/Percent.js';

export class EnergyDetail extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			energy: {},
			filter: false,
		};
	}

	componentDidMount() {
		this.reload();
	}

	reload() {
		API.instance.command('logs', 'energydetail', {day: this.props.day}).then(energy => {
			this.setState({energy: this.computePVPrct(energy)});
		});
	}

	computePVPrct(energy) {
		for(const [date, devices] of Object.entries(energy))
		{
			let d = new Date(date);
			let ratio_pv = 0;

			if(devices[0]!==undefined)
			{
				let data = devices[0];
				let grid = data.grid!==undefined?data.grid:0;
				let pv = data.pv!==undefined?data.pv:0;
				let grid_excess = data['grid-excess']!==undefined?data['grid-excess']:0;

				pv = pv - grid_excess;
				data.pv = pv;

				ratio_pv = pv / (pv + grid);
			}

			for(const [device_id, data] of Object.entries(devices))
			{
				if(device_id!=0)
				{
					energy[date][device_id].device_grid = data.device * (1 - ratio_pv);
					energy[date][device_id].device_pv = data.device * ratio_pv;
				}
			}
		}

		return energy;
	}

	renderDailySummary() {
		let summary = {0: {grid: 0, pv: 0, hws: 0, 'hws-offload': 0, 'hws-forced': 0}};

		for(const [date, devices] of Object.entries(this.state.energy))
		{
			let d = new Date(date);
			let ratio_pv = 0;

			if(devices[0]===undefined)
				continue;

			if(this.state.filter!==false)
			{
				if(this.state.filter=='day' && !devices[0].pv)
					continue;

				if(this.state.filter=='night' && devices[0].pv>0)
					continue;
			}

			let data = devices[0];
			let grid = data.grid!==undefined?data.grid:0;
			let pv = data.pv!==undefined?data.pv:0;
			let grid_excess = data['grid-excess']!==undefined?data['grid-excess']:0;
			let hws = data.hws!==undefined?data.hws:0;
			let hws_offload = data['hws-offload']!==undefined?data['hws-offload']:0;
			let hws_forced = data['hws-forced']!==undefined?data['hws-forced']:0;

			summary[0].grid += grid;
			summary[0].pv += pv - grid_excess;
			summary[0].hws += hws;
			summary[0]['hws-forced'] += hws_forced;
			summary[0]['hws-offload'] += hws_offload;

			for(const [device_id, data] of Object.entries(devices))
			{
				if(device_id!=0)
				{
					if(summary[device_id]===undefined)
						summary[device_id] = {name: data.name, device: 0, device_grid: 0, device_pv: 0};

					summary[device_id].device += data.device;
					summary[device_id].device_grid += data.device_grid;
					summary[device_id].device_pv += data.device_pv;
				}
			}
		}

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
						{this.renderSummary(summary, true)}
					</tbody>
				</table>
			</div>
		);
	}

	renderDays() {
		return Object.keys(this.state.energy).sort().reverse().map(date => {
			const devices = this.state.energy[date];

			if(devices[0]===undefined)
				return;

			if(this.state.filter!==false)
			{
				if(this.state.filter=='day' && !devices[0].pv)
					return;

				if(this.state.filter=='night' && devices[0].pv>0)
					return;
			}

			return (
				<div key={date}>
					<div className="date">{date.substr(0, 16)}</div>
					<table>
						<tbody>
							{this.renderDevices(devices)}
							{this.renderSummary(devices)}
						</tbody>
					</table>
				</div>
			);
		});
	}

	computePrct(global, energy_grid, energy_pv) {
		if(global===undefined)
			return {};

		// Normalize input
		let grid = global.grid!==undefined?global.grid:0;
		let pv = global.pv!==undefined?global.pv:0;
		if(energy_grid===undefined)
			energy_grid = 0;
		if(energy_pv===undefined)
			energy_pv = 0;

		let global_prct = 0;
		global_prct = (energy_grid + energy_pv) / (grid + pv);
		let global_prct_pv = (energy_pv + energy_grid > 0)?energy_pv / (energy_pv + energy_grid) * 100:0;
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
		return Object.keys(devices).map(device_id => {
			if(device_id==0)
				return;

			const data = devices[device_id];

			let prct = this.computePrct(devices[0], data.device_grid, data.device_pv);

			return (
				<tr key={device_id} style={{background: prct.grad}}>
					<td>{data.name}</td>
					<td>{nopower?(prct.prct + '%'):(<KW value={data.device * 4} />)}</td>
					<td><KWh value={data.device} /></td>
				</tr>
			);
		});
	}

	renderSummary(devices, nopower = false) {
		if(devices["0"]===undefined)
			return;

		const data = devices["0"];

		let prct_grid = this.computePrct(data, data.grid, 0);
		let prct_pv = this.computePrct(data, 0, data.pv);
		let prct_hws = this.computePrct(data, data['hws-forced'], data['hws-offload']);

		return (
			<React.Fragment>
				<tr style={{background: prct_hws.grad}}>
					<td>HWS</td>
					<td>{nopower?(prct_hws.prct + '%'):(<KW value={data.hws * 4} />)}</td>
					<td><KWh value={data.hws} /></td>
				</tr>
				<tr style={{background: prct_grid.grad}}>
					<td>Grid</td>
					<td>{nopower?(prct_grid.prct + '%'):(<KW value={data.grid * 4} />)}</td>
					<td><KWh value={data.grid} /></td>
				</tr>
				<tr style={{background: prct_pv.grad}}>
					<td>PV</td>
					<td>{nopower?(prct_pv.prct + '%'):(<KW value={data.pv * 4} />)}</td>
					<td><KWh value={data.pv} /></td>
				</tr>
			</React.Fragment>
		);
	}

	render() {
		return (
			<div className="sc-logsenergydetail">
				{this.renderDailySummary()}
				{this.renderDays()}
			</div>
		);
	}
}
