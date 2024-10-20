import {API} from '../websocket/API.js';
import {DateTime} from '../ui/DateTime.js';

export class LogsState extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			logs: [],
		};
	}

	componentDidMount() {
		this.reload();
	}

	reload() {
		API.instance.command('logs', 'state').then(logs => {
			this.setState({logs: logs});
		});
	}

	renderDevices() {
		return this.state.logs.map((log, idx) => {
			return (
				<tr key={idx}>
					<td>{log.device_name}</td>
					<td><DateTime value={log.log_state_date} /></td>
					<td style={{textAlign: 'center', fontWeight: 'bold'}} className={log.log_state==1?'on':'off'}>{log.log_state==1?'ON':'OFF'}</td>
					<td style={{textAlign: 'center'}}>{log.log_state_mode}</td>
				</tr>
			);
		});
	}

	render() {
		return (
			<div className="sc-logsstate">
				<table>
					<thead>
						<tr>
							<th>Device</th>
							<th>Date</th>
							<th style={{textAlign: 'center'}}>State</th>
							<th style={{textAlign: 'center'}}>Mode</th>
						</tr>
					</thead>
					<tbody>
						{this.renderDevices()}
					</tbody>
				</table>
			</div>
		);
	}
}
