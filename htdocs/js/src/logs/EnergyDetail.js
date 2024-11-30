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

	renderDailySummary() {
		let summary = {};

		let today = new Date();
		today.setHours(0,0,0,0);

		for(const [date, devices] of Object.entries(this.state.energy))
		{
			let d = new Date(date);
			if(d.getTime()<today.getTime())
				continue;

			for(const [device_id, data] of Object.entries(devices))
			{
				if(device_id==0)
				{
					if(summary[device_id]===undefined)
						summary[device_id] = {grid: 0, hws: 0, pv: 0};

					summary[device_id].grid += data.grid;
					summary[device_id].hws += data.hws;
					summary[device_id].pv += data.pv;
				}
				else
				{
					if(summary[device_id]===undefined)
						summary[device_id] = {name: data.name, device: 0};

					summary[device_id].device += data.device;
				}
			}
		}

		return (
			<div>
				<div className="date">Today</div>
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

	renderDevices(devices, nopower = false) {
		return Object.keys(devices).map(device_id => {
			if(device_id==0)
				return;

			const data = devices[device_id];

			return (
				<tr key={device_id}>
					<td>{data.name}</td>
					<td>{nopower?'':(<KW value={data.device * 4} />)}</td>
					<td><KWh value={data.device} /></td>
				</tr>
			);
		});
	}

	renderSummary(devices, nopower = false) {
		if(devices["0"]===undefined)
			return;

		const data = devices["0"];

		return (
			<React.Fragment>
				<tr>
					<td>Grid</td>
					<td>{nopower?'':(<KW value={data.grid * 4} />)}</td>
					<td><KWh value={data.grid} /></td>
				</tr>
				<tr>
					<td>PV</td>
					<td>{nopower?'':(<KW value={data.pv * 4} />)}</td>
					<td><KWh value={data.pv} /></td>
				</tr>
				<tr>
					<td>HWS</td>
					<td>{nopower?'':(<KW value={data.hws * 4} />)}</td>
					<td><KWh value={data.hws} /></td>
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
