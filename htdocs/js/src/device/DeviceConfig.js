import {TimeRanges} from '../ui/TimeRanges.js';
import {SelectHTDevice} from '../ui/SelectHTDevice.js';
import {SliderDuration} from '../ui/SliderDuration.js';
import {ConfigDeviceControl} from '../ui/ConfigDeviceControl.js';
import {ConfigDeviceMeter} from '../ui/ConfigDeviceMeter.js';

export class DeviceConfig extends React.Component
{
	constructor(props) {
		super(props);

		this.config_parts = {
			Name: {
				render: this.renderName,
				config: {}
			},
			Prio: {
				render: this.renderPrio,
				config: {prio: 0}
			},
			Meter: {
				render: this.renderMeter,
				config: {meter: {type: '3em', mqtt_id: '', phase: 'a'}}
			},
			Control: {
				render: this.renderControl,
				config: {control: {type: 'plug', ip: ''}}
			},
			ExpectedConsumption: {
				render: this.renderExpectedConsumption,
				config: {expected_consumption: 0}
			},
			Offload: {
				render: this.renderOffload,
				config: {offload: []}
			},
			Force: {
				render: this.renderForce,
				config: {force: []}
			},
			Remainder: {
				render: this.renderRemainder,
				config: {remainder: [], min_on_time: 0, min_on_for_last: 0}
			},
			MinOnOff: {
				render: this.renderMinOnOff,
				config: {min_on: 0, min_off: 0}
			},
			MaxOn: {
				render: this.renderMaxOn,
				config: {max_on: 0}
			},
			Heater: {
				render: this.renderHeater,
				config: {ht_device_id: 0, force_max_temperature: 0, offload_max_temperature: 0}
			},
			CMV: {
				render: this.renderCMV,
				config: {ht_device_ids: [], force_max_moisture: 0, offload_max_moisture: 0}
			},
			HWS: {
				render: this.renderHWS,
				config: {min_energy: 0, min_energy_for_last: 0}
			}
		};

		this.int_fields = ['prio', 'expected_consumption', 'min_on_time', 'min_on_for_last', 'min_on', 'min_off', 'ht_device_id', 'max_on', 'min_energy_for_last'];
		this.float_fields = ['force_max_temperature', 'offload_max_temperature', 'force_max_moisture', 'offload_max_moisture', 'min_energy'];

		this.change = this.change.bind(this);
	}

	componentDidMount() {
		if(this.props.device.device_config===undefined)
		{
			let device = this.props.device;
			device.device_config = this.buildDefaultConfig();
			this.props.onChange(device);
		}
	}

	buildDefaultConfig() {
		let config = {};
		for(const part of this.props.parts)
			Object.assign(config, this.config_parts[part].config);
		return config;
	}

	change(ev) {
		let device = this.props.device;
		let config = device.device_config;

		let name = ev.target.name;
		let value = ev.target.value;
		if(this.int_fields.indexOf(name)!=-1)
			value = parseInt(value);
		else if(this.float_fields.indexOf(name)!=-1)
			value = parseFloat(value);

		if(name=='device_name')
			device.device_name = value;
		else
			config[name] = value;

		this.props.onChange(device);
	}

	renderName(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>Name</dt>
				<dd><input type="text" name="device_name" value={device.device_name} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderPrio(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>Priority</dt>
				<dd><input type="number" name="prio" value={config.prio} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderMeter(device, config, onChange) {
		return (
			<ConfigDeviceMeter name="meter" value={config.meter} onChange={onChange} />
		);
	}

	renderControl(device, config, onChange) {
		return (
			<ConfigDeviceControl name="control" value={config.control} onChange={onChange} />
		);
	}

	renderExpectedConsumption(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>Expected consumption (W)</dt>
				<dd><input type="number" name="expected_consumption" value={config.expected_consumption} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderHeater(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>Linked thermometer</dt>
				<dd><SelectHTDevice type="temperature" name="ht_device_id" value={config.ht_device_id} onChange={onChange} /></dd>
				<dt>Forced mode target temperature (°C)</dt>
				<dd><input type="number" name="force_max_temperature" value={config.force_max_temperature} onChange={onChange} /></dd>
				<dt>Offload mode target temperature (°C)</dt>
				<dd><input type="number" name="offload_max_temperature" value={config.offload_max_temperature} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderCMV(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>Linked hygrometer</dt>
				<dd><SelectHTDevice type="humidity" multiple="yes" name="ht_device_ids" value={config.ht_device_ids} onChange={onChange} /></dd>
				<dt>Forced mode target moisture (%)</dt>
				<dd><input type="number" name="force_max_moisture" value={config.force_max_moisture} onChange={onChange} /></dd>
				<dt>Offload mode target moisture (%)</dt>
				<dd><input type="number" name="offload_max_moisture" value={config.offload_max_moisture} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderRemainder(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>Ensure minimum charging time of</dt>
				<dd><SliderDuration name="min_on_time" value={config.min_on_time} onChange={onChange} /></dd>
				<dt>For the last</dt>
				<dd><SliderDuration name="min_on_for_last" value={config.min_on_for_last} long={true} onChange={onChange} /></dd>
				<dt>During this period</dt>
				<dd><TimeRanges name="remainder" value={config.remainder} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderOffload(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>Offload</dt>
				<dd><TimeRanges name="offload" value={config.offload} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderForce(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>Force</dt>
				<dd><TimeRanges name="force" value={config.force} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderHWS(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>Ensure minimum Wh of</dt>
				<dd><input type="number" name="min_energy" value={config.min_energy} onChange={onChange} /></dd>
				<dt>For the last</dt>
				<dd><SliderDuration type="days" name="min_energy_for_last" value={config.min_energy_for_last} long={true} onChange={onChange} /></dd>
				<dt>During this period</dt>
				<dd><TimeRanges name="remainder" value={config.remainder} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderMaxOn(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>Maximum on time</dt>
				<dd><SliderDuration name="max_on" value={config.max_on} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderMinOnOff(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>Minimum on time</dt>
				<dd><SliderDuration name="min_on" value={config.min_on} onChange={onChange} /></dd>
				<dt>Minimum off time</dt>
				<dd><SliderDuration name="min_off" value={config.min_off} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderConfigParts() {
		return this.props.parts.map(part => {
			const config = this.config_parts[part];
			return (
				<React.Fragment key={part}>
					{config.render(this.props.device, this.props.device.device_config, this.change)}
				</React.Fragment>
			);
		});
	}

	render() {
		if(this.props.device.device_config===undefined)
			return; // Not initialized yet

		return (
			<dl>
				{this.renderConfigParts()}
			</dl>
		);
	}
}
