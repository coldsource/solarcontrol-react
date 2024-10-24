import {App} from '../app/App.js';
import {API} from '../websocket/API.js';
import {Subscreen} from '../ui/Subscreen.js';
import {Loader} from '../ui/Loader.js';
import {TimeRange} from '../ui/TimeRange.js';
import {SelectDeviceType} from '../ui/SelectDeviceType.js';
import {SelectHTDevice} from '../ui/SelectHTDevice.js';
import {SliderDuration} from '../ui/SliderDuration.js';

export class DeviceOnOff extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			device: null,
			ht_devices: []
		};

		this.save = this.save.bind(this);
		this.deletedevice = this.deletedevice.bind(this);
		this.changeDevice = this.changeDevice.bind(this);
		this.changeConfig = this.changeConfig.bind(this);
	}

	componentDidMount() {
		if(this.props.id==0)
		{
			this.setState({device: {
				device_type: 'timerange-plug',
				device_name: 'New device',
				device_config: {
					ip: '',
					prio: 0,
					expected_consumption: 0,
					offload: [],
					force: [],
					remainder: [],
					min_on_time: 0,
					min_on_for_last: 0,
					min_on: 0,
					min_off: 0,
					ht_device_id: 0,
					force_max_temperature: 0,
					offload_max_temperature: 0
				}
			}});
		}
		else
		{
			API.instance.command('deviceonoff', 'get', {device_id: parseInt(this.props.id)}).then(device => {
				if(device.device_type=='hws')
					device.device_config.min_energy_for_last = device.device_config.min_energy_for_last * 86400; // Convert days to seconds

				this.setState({device: device});
			});
		}
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
		const device = this.state.device;
		const config = device.device_config;

		let params = {
			device_name: device.device_name,
			device_config: {
				ip: config.ip,
				prio: parseInt(config.prio),
				expected_consumption: parseInt(config.expected_consumption),
				offload: config.offload,
				force: config.force,
				remainder: config.remainder,
				min_on_time: parseInt(config.min_on_time),
				min_on_for_last: parseInt(config.min_on_for_last),
				min_on: parseInt(config.min_on),
				min_off: parseInt(config.min_off)
			}
		};

		if(device.device_type=='heater')
		{
			params.device_config.ht_device_id = parseInt(config.ht_device_id);
			params.device_config.force_max_temperature = parseFloat(config.force_max_temperature);
			params.device_config.offload_max_temperature = parseFloat(config.offload_max_temperature);
		}

		if(device.device_type=='hws')
		{
			params.device_config.min_energy = parseFloat(config.min_energy);
			params.device_config.min_energy_for_last = parseInt(config.min_energy_for_last) / 86400;
		}

		let cmd;
		if(this.props.id!=0)
		{
			params.device_id = parseInt(device.device_id);
			cmd = 'set';
		}
		else
		{
			params.device_type = device.device_type;
			cmd = 'create';
		}

		API.instance.command('deviceonoff', cmd, params).then(res => {
			App.message("Device saved");
			if(device.device_type=='hws')
				return;

			this.props.onClose();
		});
	}

	deletedevice() {
		API.instance.command('deviceonoff', 'delete', {device_id:parseInt(this.state.device.device_id)}).then(res => {
			App.message("Device removed");
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
				<TimeRange value={time_range} onChange={ev => this.changeTimeRange(name, idx, ev.target.value)} />
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

	renderDeviceType() {
		if(this.props.id!=0)
			return;

		const device = this.state.device;

		return (
			<SelectDeviceType name="device_type" value={device.device_type} onChange={this.changeDevice} />
		);
	}

	renderNamePrio() {
		const device = this.state.device;

		if(device.device_type=='hws')
			return;

		const config = device.device_config;

		return (
			<React.Fragment>
				<dt>Name</dt>
				<dd><input type="text" name="device_name" value={device.device_name} onChange={this.changeDevice} /></dd>
				<dt>Priority</dt>
				<dd><input type="number" name="prio" value={config.prio} onChange={this.changeConfig} /></dd>
			</React.Fragment>
		);
	}

	renderExpectedConsumption() {
		const device = this.state.device;

		if(device.device_type=='hws')
			return;

		const config = device.device_config;

		return (
			<React.Fragment>
				<dt>Expected consumption (W)</dt>
				<dd><input type="number" name="expected_consumption" value={config.expected_consumption} onChange={this.changeConfig} /></dd>
			</React.Fragment>
		);
	}

	renderHeaterFields() {
		const device = this.state.device;

		if(device.device_type!='heater')
			return;

		const config = device.device_config;

		return (
			<React.Fragment>
				<dt>Linked thermometer</dt>
				<dd><SelectHTDevice  name="ht_device_id" value={config.ht_device_id} onChange={this.changeConfig} /></dd>
				<dt>Forced mode target temperature (°C)</dt>
				<dd><input type="number" name="force_max_temperature" value={config.force_max_temperature} onChange={this.changeConfig} /></dd>
				<dt>Offload mode target temperature (°C)</dt>
				<dd><input type="number" name="offload_max_temperature" value={config.offload_max_temperature} onChange={this.changeConfig} /></dd>
			</React.Fragment>
		);
	}

	renderRemainderFields() {
		const device = this.state.device;

		if(device.device_type!='timerange-plug')
			return;

		const config = device.device_config;

		return (
			<React.Fragment>
				<dt>Ensure minimum charging time of</dt>
				<dd><SliderDuration name="min_on_time" value={config.min_on_time} onChange={this.changeConfig} /></dd>
				<dt>For the last</dt>
				<dd><SliderDuration name="min_on_for_last" value={config.min_on_for_last} long={true} onChange={this.changeConfig} /></dd>
				<dt>During this period</dt>
				<dd>{this.renderTimeRangesArray('remainder', config.remainder)}</dd>
			</React.Fragment>
		);
	}

	renderOffloadFields() {
		const device = this.state.device;

		if(device.device_type=='hws')
			return;

		const config = device.device_config;

		return (
			<React.Fragment>
				<dt>Offload</dt>
				<dd>{this.renderTimeRangesArray('offload', config.offload)}</dd>
			</React.Fragment>
		);
	}

	renderRemainderFieldsHWS() {
		const device = this.state.device;

		if(device.device_type!='hws')
			return;

		const config = device.device_config;

		return (
			<React.Fragment>
				<dt>Ensure minimum kWh of</dt>
				<dd><input type="number" name="min_energy" value={config.min_energy} onChange={this.changeConfig} /></dd>
				<dt>For the last</dt>
				<dd><SliderDuration type="days" name="min_energy_for_last" value={config.min_energy_for_last} long={true} onChange={this.changeConfig} /></dd>
				<dt>During this period</dt>
				<dd>{this.renderTimeRangesArray('remainder', config.remainder)}</dd>
			</React.Fragment>
		);
	}

	renderMinOnOff() {
		const device = this.state.device;

		if(device.device_type=='hws')
			return;

		const config = device.device_config;

		return (
			<React.Fragment>
				<dt>Minimum on time</dt>
				<dd><SliderDuration name="min_on" value={config.min_on} onChange={this.changeConfig} /></dd>
				<dt>Minimum off time</dt>
				<dd><SliderDuration name="min_off" value={config.min_off} onChange={this.changeConfig} /></dd>
			</React.Fragment>
		);
	}

	renderDelete() {
		if(this.props.id==0)
			return;

		if(this.state.device!==null && this.state.device.device_type=='hws')
			return;

		return (
			<React.Fragment>
				<br />
				<div className="warning-btn" onClick={this.deletedevice}>Remove device</div>
			</React.Fragment>
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
							{this.renderDeviceType()}
							{this.renderNamePrio()}
							<dt>IP address</dt>
							<dd><input type="text" name="ip" value={config.ip} onChange={this.changeConfig} /></dd>
							{this.renderHeaterFields()}
							{this.renderExpectedConsumption()}
							{this.renderOffloadFields()}
							<dt>Force</dt>
							<dd>{this.renderTimeRangesArray('force', config.force)}</dd>
							{this.renderRemainderFields()}
							{this.renderRemainderFieldsHWS()}
							{this.renderMinOnOff()}
						</dl>
						<div className="submit" onClick={this.save}>Save</div>
						{this.renderDelete()}
					</div>
				</Subscreen>
			</div>
		);
	}
}
