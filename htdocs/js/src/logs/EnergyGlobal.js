import {API} from '../websocket/API.js';
import {DateOnly} from '../ui/DateOnly.js';
import {KWh} from '../ui/KWh.js';
import {Euro} from '../ui/Euro.js';
import {Percent} from '../ui/Percent.js';
import {Loader} from '../ui/Loader.js';
import {NormalizeEnergyLog, ReduceEnergyLog} from './EnergyLog.js';

export class EnergyGlobal extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			mode: 'global',
			energy: {},
			pricing: null,
		};
	}

	componentDidMount() {
		this.reload();
	}

	async reload() {
		let energy = await API.instance.command('logs', 'energy', {mbefore: this.props.mbefore});
		energy = NormalizeEnergyLog(energy);

		let pricing = await API.instance.command('storage', 'get', {name: 'pricing'});

		this.setState({energy: energy, pricing: pricing, loading: false});
	}

	// Render kWh or Euros based on pricing table, offpeak and peak energy
	renderKWHEuro(data, type) {
		if(data===undefined)
			return;

		const unit = this.props.unit;
		const pricing = this.state.pricing;

		if(unit=='euro')
		{
			if(pricing===null)
				return;

			if(!pricing.global && !pricing.peak && !pricing.offpeak)
				return;
		}

		let global_wh = data.energy;
		let peak_wh = data.peak;
		let offpeak_wh = data.offpeak;

		let global_kwh = global_wh / 1000;
		let peak_kwh = peak_wh / 1000;
		let offpeak_kwh = offpeak_wh / 1000;

		if(type=='global')
		{
			if(unit=='kwh')
				return (<KWh value={global_wh} />);
			else
			{
				if(pricing.global)
					return (<Euro value={global_kwh * pricing.global} />);
				else
					return (<Euro value={peak_kwh * pricing.peak + offpeak_kwh * pricing.offpeak} />);
			}
		}

		if(type=='offpeak')
		{
			if(unit=='kwh')
				return (<KWh value={offpeak_wh} />);
			else
			{
				if(pricing.global)
					return (<Euro value={offpeak_kwh * pricing.global} />);
				else
					return (<Euro value={offpeak_kwh * pricing.offpeak} />);
			}
		}

		if(type=='peak')
		{
			if(unit=='kwh')
				return (<KWh value={peak_wh} />);
			else
			{
				if(pricing.global)
					return (<Euro value={peak_kwh * pricing.global} />);
				else
					return (<Euro value={peak_kwh * pricing.peak} />);
			}
		}
	}

	renderHistory() {
		if(this.props.device!='')
		{
			let device = this.props.device;
			return Object.keys(this.state.energy).sort().reverse().map(date => {
				const data = this.state.energy[date];

				if(data[device]===undefined)
					return; // No data for this day

				return (
					<tr key={date}>
						<td><DateOnly value={date} /></td>
						<td>{this.renderKWHEuro(data[device].consumption, 'global')}</td>
						<td>{this.renderKWHEuro(data[device].offload, 'global')}</td>
						<td><Percent v1={data[device].offload.energy} v2={data[device].consumption.energy - data[device].offload.energy} /></td>
						<td><Percent v1={data[device].consumption.offpeak - data[device].offload.offpeak} v2={data[device].consumption.peak - data[device].offload.peak} /></td>
					</tr>
				);
			});
		}

		if(this.state.mode=='global')
		{
			return Object.keys(this.state.energy).sort().reverse().map(date => {
				const data = this.state.energy[date];

				return (
					<tr key={date}>
						<td onClick={() => this.props.onClickDay(date)}><DateOnly value={date} /></td>
						<td>{this.renderKWHEuro(data.grid.consumption, 'global')}</td>
						<td>{this.renderKWHEuro(data.pv.consumption, 'global')}</td>
						<td><Percent v1={data.pv.consumption.energy} v2={data.grid.consumption.energy} /></td>
						<td>{this.renderKWHEuro(data.hws.consumption, 'global')}</td>
					</tr>
				);
			});
		}

		if(this.state.mode=='offpeak')
		{
			return Object.keys(this.state.energy).sort().reverse().map(date => {
				const data = this.state.energy[date];
				return (
					<tr key={date + "_offpeak"}>
						<td><DateOnly value={date} /></td>
						<td>{this.renderKWHEuro(data.grid.consumption, 'offpeak')}</td>
						<td>{this.renderKWHEuro(data.grid.consumption, 'peak')}</td>
						<td><Percent v1={data.grid.consumption.offpeak} v2={data.grid.consumption.peak} /></td>
					</tr>
				);
			});
		}

		if(this.state.mode=='pv')
		{
			return Object.keys(this.state.energy).sort().reverse().map(date => {
				const data = this.state.energy[date];
				return (
					<tr key={date + "_pv"}>
						<td><DateOnly value={date} /></td>
						<td>{this.renderKWHEuro(data.pv.production, 'global')}</td>
						<td>{this.renderKWHEuro(data.battery.production, 'global')}</td>
						<td>{this.renderKWHEuro(data.grid.excess, 'global')}</td>
						<td><Percent v1={data.pv.consumption.energy} v2={data.grid.excess.energy} /></td>
					</tr>
				);
			});
		}

		if(this.state.mode=='hws')
		{
			return Object.keys(this.state.energy).sort().reverse().map(date => {
				const data = this.state.energy[date];
				return (
					<tr key={date + "_hws"}>
						<td><DateOnly value={date} /></td>
						<td>{this.renderKWHEuro(data.hws.offload, 'global')}</td>
						<td>{this.renderKWHEuro(data.hws.grid, 'global')}</td>
						<td><Percent v1={data.hws.offload.energy} v2={data.hws.grid.energy} /></td>
					</tr>
				);
			});
		}
	}

	renderTotal() {
		let total = ReduceEnergyLog(this.state.energy);

		if(this.props.device!='')
		{
			let device = this.props.device;

			if(total[device]===undefined)
				return;

			return (
				<tr key="total">
					<td><b>Total</b></td>
					<td>{this.renderKWHEuro(total[device].consumption, 'global')}</td>
					<td>{this.renderKWHEuro(total[device].offload, 'global')}</td>
					<td><Percent v1={total[device].offload.energy} v2={total[device].consumption.energy - total[device].offload.energy} /></td>
					<td><Percent v1={total[device].consumption.offpeak - total[device].offload.offpeak} v2={total[device].consumption.peak - total[device].offload.peak} /></td>
				</tr>
			);
		}

		if(this.state.mode=='global')
		{
			return (
				<tr key="total">
					<td><b>Total</b></td>
					<td>{this.renderKWHEuro(total.grid.consumption, 'global')}</td>
					<td>{this.renderKWHEuro(total.pv.consumption, 'global')}</td>
					<td><Percent v1={total.pv.consumption.energy} v2={total.grid.consumption.energy} /></td>
					<td>{this.renderKWHEuro(total.hws.consumption, 'global')}</td>
				</tr>
			);
		}

		if(this.state.mode=='offpeak')
		{
			return (
				<tr key={"total_offpeak"}>
					<td><b>Total</b></td>
					<td>{this.renderKWHEuro(total.grid.consumption, 'offpeak')}</td>
					<td>{this.renderKWHEuro(total.grid.consumption, 'peak')}</td>
					<td><Percent v1={total.grid.consumption.offpeak} v2={total.grid.consumption.peak} /></td>
				</tr>
			);
		}

		if(this.state.mode=='pv')
		{
			return (
				<tr key={"total_pv"}>
					<td><b>Total</b></td>
					<td>{this.renderKWHEuro(total.pv.production, 'global')}</td>
					<td>{this.renderKWHEuro(total.battery.production, 'global')}</td>
					<td>{this.renderKWHEuro(total.grid.excess, 'global')}</td>
					<td><Percent v1={total.pv.consumption.energy} v2={total.grid.excess.energy} /></td>
				</tr>
			);
		}

		if(this.state.mode=='hws')
		{
			return (
				<tr key={"total_hws"}>
					<td><b>Total</b></td>
					<td>{this.renderKWHEuro(total.hws.offload, 'global')}</td>
					<td>{this.renderKWHEuro(total.hws.grid, 'global')}</td>
					<td><Percent v1={total.hws.offload.energy} v2={total.hws.grid.energy} /></td>
				</tr>
			);
		}
	}

	renderHeader() {
		if(this.props.device!='')
		{
			return (
				<thead>
					<tr>
						<th>Date</th>
						<th>Consumption</th>
						<th>Offload</th>
						<th>PV %</th>
						<th>Offpeak %</th>
					</tr>
				</thead>
			);
		}

		if(this.state.mode=='global')
		{
			return (
				<thead>
					<tr>
						<th>Date</th>
						<th onClick={() => this.setState({mode: 'offpeak'})}>Grid <i className="scf scf-leaf" /></th>
						<th onClick={() => this.setState({mode: 'pv'})}>PV <i className="scf scf-bolt" /></th>
						<th>PV&#160;<i className="scf scf-percent" /></th>
						<th onClick={() => this.setState({mode: 'hws'})}>HWS <i className="scf scf-sun" /></th>
					</tr>
				</thead>
			);
		}

		if(this.state.mode=='offpeak')
		{
			return (
				<thead>
					<tr>
						<th>Date</th>
						<th colSpan="2" onClick={() => this.setState({mode: 'global'})}>Grid <i className="scf scf-leaf" /></th>
					</tr>
					<tr>
						<th></th>
						<th>Offpeak</th>
						<th>Peak</th>
						<th>Ratio</th>
					</tr>
				</thead>
			);
		}

		if(this.state.mode=='pv')
		{
			return (
				<thead>
					<tr>
						<th>Date</th>
						<th colSpan="3" onClick={() => this.setState({mode: 'global'})}>PV <i className="scf scf-bolt" /></th>
					</tr>
					<tr>
						<th></th>
						<th>Prod.</th>
						<th>Battery</th>
						<th>Excess</th>
						<th>Ratio</th>
					</tr>
				</thead>
			);
		}

		if(this.state.mode=='hws')
		{
			return (
				<thead>
					<tr>
						<th>Date</th>
						<th colSpan="2" onClick={() => this.setState({mode: 'global'})}>HWS <i className="scf scf-sun" /></th>
					</tr>
					<tr>
						<th></th>
						<th>Offload</th>
						<th>Forced</th>
						<th>Ratio</th>
					</tr>
				</thead>
			);
		}
	}

	render() {
		if(this.state.loading)
			return (<Loader />);

		if(Object.keys(this.state.energy).length==0)
			return (<div className="center">No data to display</div>);

		return (
			<div className="sc-logsenergy">
				<table className="layout-evenodd">
					{this.renderHeader()}
					<tbody>
						{this.renderHistory()}
						{this.renderTotal()}
					</tbody>
				</table>
			</div>
		);
	}
}
