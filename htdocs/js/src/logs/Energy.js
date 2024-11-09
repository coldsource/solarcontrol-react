import {API} from '../websocket/API.js';
import {DateOnly} from '../ui/DateOnly.js';
import {KWh} from '../ui/KWh.js';

export class Energy extends React.Component
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
						<td><DateOnly value={date} /></td>
						<td><KWh value={data.grid_consumption} /></td>
						<td><KWh value={data.grid_excess} /></td>
						<td><KWh value={data.pv_production} /></td>
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
						<th colSpan="2" onClick={() => this.setState({mode: 'offpeak'})}>Grid <i className="fa-regular fa-leaf" /></th>
						<th>PV</th>
						<th>HWS</th>
					</tr>
					<tr>
						<th></th>
						<th>Cons.</th>
						<th>Excess</th>
						<th></th>
						<th></th>
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
						<th colSpan="2" onClick={() => this.setState({mode: 'global'})}>Grid <i className="fa-regular fa-leaf" /></th>
					</tr>
					<tr>
						<th></th>
						<th>Offpeak</th>
						<th>Peak</th>
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
