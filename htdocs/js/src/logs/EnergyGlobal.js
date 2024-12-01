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
		API.instance.command('logs', 'energy').then(energy => {
			this.setState({energy: energy});
		});
	}

	renderHistory() {
		if(this.state.mode=='global')
		{
			return Object.keys(this.state.energy).sort().reverse().map(date => {
				const data = this.state.energy[date];
				return (
					<tr key={date}>
						<td onClick={() => this.props.onClickDay(date)}><DateOnly value={date} /></td>
						<td><KWh value={data.grid_consumption} /></td>
						<td><KWh value={data.pv_production - data.grid_excess} /></td>
						<td><Percent v1={data.pv_production - data.grid_excess} v2={data.grid_consumption} /></td>
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

	renderHeader() {
		if(this.state.mode=='global')
		{
			return (
				<thead>
					<tr>
						<th>Date</th>
						<th onClick={() => this.setState({mode: 'offpeak'})}>Grid <i className="fa-regular fa-leaf" /></th>
						<th onClick={() => this.setState({mode: 'pv'})}>PV <i className="fa-regular fa-bolt" /></th>
						<th>PV&#160;%</th>
						<th onClick={() => this.setState({mode: 'hws'})}>HWS <i className="fa-regular fa-sun-bright" /></th>
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
						<th colSpan="3" onClick={() => this.setState({mode: 'global'})}>Grid <i className="fa-regular fa-leaf" /></th>
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
						<th colSpan="3" onClick={() => this.setState({mode: 'global'})}>PV <i className="fa-regular fa-bolt" /></th>
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
						<th colSpan="3" onClick={() => this.setState({mode: 'global'})}>HWS <i className="fa-regular fa-sun-bright" /></th>
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
					</tbody>
				</table>
			</div>
		);
	}
}
