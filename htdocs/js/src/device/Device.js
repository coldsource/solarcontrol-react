import {API} from '../websocket/API.js';
import {Subscreen} from '../ui/Subscreen.js';
import {Loader} from '../ui/Loader.js';
import {TimeRange} from '../ui/TimeRange.js';

export class Device extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			device: null
		};

		this.save = this.save.bind(this);
		this.changeDevice = this.changeDevice.bind(this);
		this.changeConfig = this.changeConfig.bind(this);
	}

	componentDidMount() {
		API.instance.command('device', 'get', {device_id: parseInt(this.props.id)}).then(device => {
			this.setState({device: device});
		});
	}

	normalize_time(t) {
		const parts = /^([0-9]+):([0-9]+)(:([0-9]+))?/.exec(t);
		let nt = parts[1].padStart(2, '0') + ':' + parts[2].padStart(2, '0');
		if(parts.length>=5 && parts[4]!==undefined)
			nt += ':' + parts[4].padStart(2, '0');
		else
			nt += ':00';
		return nt;
	}

	save() {
		this.state.device.device_id = parseInt(this.state.device.device_id);
		this.state.device.device_prio = parseInt(this.state.device.device_prio);
		this.state.device.device_config.expected_consumption = parseInt(this.state.device.device_config.expected_consumption);
		const device = this.state.device;
		API.instance.command('device', 'set', device).then(res => {
			this.props.onClose();
		});
	}

	changeDevice(ev) {
		let device = Object.assign({}, this.state.device);
		device[ev.target.name] = ev.target.value;
		this.setState({device: device});
	}

	changeConfig(ev) {
		let config = Object.assign({}, this.state.device.device_config);
		config[ev.target.name] = ev.target.value;

		let device = Object.assign({}, this.state.device);
		device.device_config = config;
		this.setState({device: device});
	}

	changeTimeRange(name, idx, value) {
		value.from = this.normalize_time(value.from);
		value.to = this.normalize_time(value.to);

		let time_range = this.state.device.device_config[name];
		time_range[idx] = value;
		this.changeConfig({target: {name: name, value: time_range}});
	}

	addTimeRange(name) {
		let time_range = this.state.device.device_config[name];
		time_range.push({from: "00:00:00", to: "23:59:00"});
		this.changeConfig({target: {name: name, value: time_range}});
	}

	removeTimeRange(name, idx) {
		let time_range = this.state.device.device_config[name];
		time_range.splice(idx, 1);
		this.changeConfig({target: {name: name, value: time_range}});
	}

	renderTimeRange(name, time_range, idx) {
		return (
			<div className="timerange">
				<TimeRange value={{from: time_range.from, to: time_range.to}} onChange={ev => this.changeTimeRange(name, idx, ev.target.value)} />
				<i className="fa fa-remove" onClick={ev => this.removeTimeRange(name, idx)} />
			</div>
		);
	}

	renderTimeRanges(name, time_ranges) {
		return time_ranges.map((time_range, idx) => {
			return (
				<div key={idx}>
					{this.renderTimeRange(name, time_range, idx)}
				</div>
			);
		});
	}

	renderTimeRangesArray(name, time_ranges) {
		return (
			<div>
				{this.renderTimeRanges(name, time_ranges)}
				<div className="add-timerange" onClick={ev => this.addTimeRange(name)}>Add time range</div>
			</div>
		);
	}

	render() {
		const device = this.state.device;

		if(device===null)
			return (<Loader />);

		const config = device.device_config;

		return (
			<div className="sc-device">
				<Subscreen title={device.device_name} onClose={this.props.onClose}>
					<div className="layout-form">
						<dl>
							<dt>Name</dt>
							<dd><input type="text" name="device_name" value={device.device_name} onChange={this.changeDevice} /></dd>
							<dt>Priority</dt>
							<dd><input type="text" name="device_prio" value={device.device_prio} onChange={this.changeDevice} /></dd>
							<dt>IP address</dt>
							<dd><input type="text" name="ip" value={config.ip} onChange={this.changeConfig} /></dd>
							<dt>Expected consumption (W)</dt>
							<dd><input type="text" name="expected_consumption" value={config.expected_consumption} onChange={this.changeConfig} /></dd>
							<dt>Offload</dt>
							<dd>{this.renderTimeRangesArray('offload', config.offload)}</dd>
							<dt>Force</dt>
							<dd>{this.renderTimeRangesArray('force', config.force)}</dd>
						</dl>
						<div className="submit" onClick={this.save}>Save</div>
					</div>
				</Subscreen>
			</div>
		);
	}
}
