import {API} from '../websocket/API.js';
import {DateOnly} from '../ui/DateOnly.js';
import {KWh} from '../ui/KWh.js';

export class Energy extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
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

	render() {
		return (
			<div className="sc-logsenergy">
				<table className="layout-evenodd">
					<thead>
						<tr>
							<th>Date</th>
							<th colSpan="2">Grid</th>
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
					<tbody>
						{this.renderHistory()}
					</tbody>
				</table>
			</div>
		);
	}
}
