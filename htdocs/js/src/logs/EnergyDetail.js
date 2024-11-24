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
		};
	}

	componentDidMount() {
		this.reload();
	}

	reload() {
		API.instance.command('logs', 'energydetail').then(energy => {
			this.setState({energy: energy});
		});
	}

	renderDays() {
		return Object.keys(this.state.energy).sort().reverse().map(date => {
			const devices = this.state.energy[date];
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

	renderDevices(devices) {
		return Object.keys(devices).map(device_id => {
			if(device_id==0)
				return;

			const data = devices[device_id];

			return (
				<tr key={device_id}>
					<td>{data.name}</td>
					<td><KW value={data.device * 4} /></td>
					<td><KWh value={data.device} /></td>
				</tr>
			);
		});
	}

	renderSummary(devices) {
		if(devices["0"]===undefined)
			return;

		const data = devices["0"];

		return (
			<React.Fragment>
				<tr>
					<td>Grid</td>
					<td><KW value={data.grid * 4} /></td>
					<td><KWh value={data.grid} /></td>
				</tr>
				<tr>
					<td>PV</td>
					<td><KW value={data.pv * 4} /></td>
					<td><KWh value={data.pv} /></td>
				</tr>
				<tr>
					<td>HWS</td>
					<td><KW value={data.hws * 4} /></td>
					<td><KWh value={data.hws} /></td>
				</tr>
			</React.Fragment>
		);
	}

	render() {
		return (
			<div className="sc-logsenergydetail">
				{this.renderDays()}
			</div>
		);
	}
}
