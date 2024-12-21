import {API} from '../websocket/API.js';
import {DateOnly} from '../ui/DateOnly.js';
import {KWh} from '../ui/KWh.js';
import {Percent} from '../ui/Percent.js';

export class EnergyGlobal extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			mode: 'global',
			energy: {},
		};
	}

	componentDidMount() {
		this.reload();
	}

	reload() {
		API.instance.command('logs', 'energy', {mbefore: this.props.mbefore}).then(energy => {
			this.setState({energy: energy});
		});
	}

	renderHistory() {
		if(this.state.mode=='global')
		{
			return Object.keys(this.state.energy).sort().reverse().map(date => {
				const data = this.state.energy[date];

				let pv_production = data.pv_production?data.pv_production:0;
				let grid_excess = data.grid_excess?data.grid_excess:0;

				return (
					<tr key={date}>
						<td onClick={() => this.props.onClickDay(date)}><DateOnly value={date} /></td>
						<td><KWh value={data.grid_consumption} /></td>
						<td><KWh value={pv_production - grid_excess} /></td>
						<td><Percent v1={pv_production - grid_excess} v2={data.grid_consumption} /></td>
						<td><KWh value={data.hws_consumption} /></td>
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
						<td><KWh value={data.offpeak_consumption} /></td>
						<td><KWh value={data.peak_consumption} /></td>
						<td><Percent v1={data.offpeak_consumption} v2={data.peak_consumption} /></td>
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
						<td><KWh value={data.pv_production} /></td>
						<td><KWh value={data.grid_excess} /></td>
						<td><Percent v1={data.pv_production} v2={data.grid_excess} /></td>
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
						<td><KWh value={data.hws_offload_consumption} /></td>
						<td><KWh value={data.hws_forced_consumption} /></td>
						<td><Percent v1={data.hws_offload_consumption} v2={data.hws_forced_consumption} /></td>
					</tr>
				);
			});
		}
	}

	renderTotal() {
		if(this.state.mode=='global')
		{
			let total = Object.values(this.state.energy).reduce((acc, data) => {
				let grid_consumption = data.grid_consumption?data.grid_consumption:0;
				let pv_production = data.pv_production?data.pv_production:0;
				let grid_excess = data.grid_excess?data.grid_excess:0;
				let hws_consumption = data.hws_consumption?data.hws_consumption:0;
				acc.grid += grid_consumption;
				acc.pv += pv_production - grid_excess;
				acc.hws += hws_consumption;
				return acc;
			}, {grid: 0, pv: 0, hws: 0});

			return (
				<tr key="total">
					<td><b>Total</b></td>
					<td><KWh value={total.grid} /></td>
					<td><KWh value={total.pv} /></td>
					<td><Percent v1={total.pv} v2={total.grid} /></td>
					<td><KWh value={total.hws} /></td>
				</tr>
			);
		}

		if(this.state.mode=='offpeak')
		{
			let total = Object.values(this.state.energy).reduce((acc, data) => {
				let offpeak_consumption = data.offpeak_consumption?data.offpeak_consumption:0;
				let peak_consumption = data.peak_consumption?data.peak_consumption:0;
				acc.offpeak += offpeak_consumption;
				acc.peak += peak_consumption;
				return acc;
			}, {offpeak: 0, peak: 0});

			return (
				<tr key={"total_offpeak"}>
					<td><b>Total</b></td>
					<td><KWh value={total.offpeak} /></td>
					<td><KWh value={total.peak} /></td>
					<td><Percent v1={total.offpeak} v2={total.peak} /></td>
				</tr>
			);
		}

		if(this.state.mode=='pv')
		{
			let total = Object.values(this.state.energy).reduce((acc, data) => {
				let pv_production = data.pv_production?data.pv_production:0;
				let grid_excess = data.grid_excess?data.grid_excess:0;
				acc.pv_production += pv_production;
				acc.grid_excess += grid_excess;
				return acc;
			}, {pv_production: 0, grid_excess: 0});

			return (
				<tr key={"total_pv"}>
					<td><b>Total</b></td>
					<td><KWh value={total.pv_production} /></td>
					<td><KWh value={total.grid_excess} /></td>
					<td><Percent v1={total.pv_production} v2={total.grid_excess} /></td>
				</tr>
			);
		}

		if(this.state.mode=='hws')
		{
			let total = Object.values(this.state.energy).reduce((acc, data) => {
				let hws_offload_consumption = data.hws_offload_consumption?data.hws_offload_consumption:0;
				let hws_forced_consumption = data.hws_forced_consumption?data.hws_forced_consumption:0;
				acc.hws_offload_consumption += hws_offload_consumption;
				acc.hws_forced_consumption += hws_forced_consumption;
				return acc;
			}, {hws_offload_consumption: 0, hws_forced_consumption: 0});

			return (
				<tr key={"total_hws"}>
					<td><b>Total</b></td>
					<td><KWh value={total.hws_offload_consumption} /></td>
					<td><KWh value={total.hws_forced_consumption} /></td>
					<td><Percent v1={total.hws_offload_consumption} v2={total.hws_forced_consumption} /></td>
				</tr>
			);
		}
	}

	renderHeader() {
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
						<th colSpan="2" onClick={() => this.setState({mode: 'global'})}>PV <i className="scf scf-bolt" /></th>
					</tr>
					<tr>
						<th></th>
						<th>Prod.</th>
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
