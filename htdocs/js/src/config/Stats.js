import {Stats as ProtocolStats} from '../websocket/Stats.js';
import {KW} from '../ui/KW.js';
import {App} from '../app/App.js';

export class Stats extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			stats: null,
			freq_idx: false,
			freq_type: 'fast',
		};

		this.ref = React.createRef();

		this.changeStats = this.changeStats.bind(this);
	}

	componentDidMount() {
		this.stats = new ProtocolStats(this.changeStats);

		App.loader(true);
	}

	changeStats(stats) {
		if(this.state.stats===null)
			App.loader(false);

		this.setState({stats: stats});
	}

	getFreq() {
		return this.state.stats.controllable_power_frequency[this.state.freq_type];
	}

	renderFrequencies() {
		const freq = this.getFreq();

		return freq.map((freq, idx) => {
			return (
				<div key={idx} onClick={ () => this.setState({freq_idx: idx}) } >
					<div style={{backgroundColor: 'green', height: (freq.frequency * 100) + '%'}}>
					</div>
				</div>
			);
		});
	}

	renderFrequencyLegend() {
		const freq = this.getFreq();

		return (
			<div className="freqlegend">
				<div><KW value={freq[0].range} /></div>
				<div><KW value={freq[freq.length-1].range} /></div>
			</div>
		);
	}

	renderFrequencyDetail() {
		if(this.state.freq_idx===false)
			return;

		const freqs = this.getFreq();

		return (
			<div>
				At least <KW value={freqs[this.state.freq_idx].range} /> : <b>{(freqs[this.state.freq_idx].frequency * 100).toFixed(1)} %</b>
			</div>
		);
	}

	renderDevicesPredictions() {
		const devices = this.state.stats.devices;

		return devices.map(device => {
			return (
				<tr key={device.device_id}>
					<td>{device.device_name}</td>
					<td>{device.type}</td>
					<td>{device.wanted_state}</td>
					<td>{(device.prediction * 100).toFixed(1)} %</td>
				</tr>
			);
		});
	}

	render() {
		if(this.state.stats===null)
			return;

		const stats = this.state.stats;

		return (
			<div className="sc-stats">
				<dl>
					<dt>Controlled power</dt>
					<dd><KW value={stats.controlled_power} /></dd>
					<dt>Controllable power</dt>
					<dd><KW value={stats.controllable_power} /></dd>
					<dt>Controllable power average</dt>
					<dd><KW value={stats.controllable_power_avg} /></dd>
					<dt>Weather</dt>
					<dd>{stats.weather_type}</dd>
				</dl>
				<br />
				<h2>Controllable Power Frequency Distribution</h2>
				<div className="freq">
					<div className="types">
						<span className={this.state.freq_type=='fast'?'selected':''} onClick={ () => this.setState({freq_type: 'fast', freq_idx: false}) }>Fast</span>
						<span className={this.state.freq_type=='medium'?'selected':''} onClick={ () => this.setState({freq_type: 'medium', freq_idx: false}) }>Medium</span>
						<span className={this.state.freq_type=='slow'?'selected':''} onClick={ () => this.setState({freq_type: 'slow', freq_idx: false}) }>Slow</span>
					</div>
					<div className="graph" style={{display: 'grid', gridTemplateColumns: 'repeat(' + this.getFreq().length + ', 1fr)'}}>
						{this.renderFrequencies()}
					</div>
					{this.renderFrequencyLegend()}
					{this.renderFrequencyDetail()}
				</div>
				<br />
				<h2>Devices predictions</h2>
					<table className="predictions">
						<thead>
							<tr>
								<th>Device</th>
								<th>Type</th>
								<th>Wanted state</th>
								<th>Prediction</th>
							</tr>
						</thead>
						<tbody>
							{this.renderDevicesPredictions()}
						</tbody>
					</table>
			</div>
		);
	}
}
