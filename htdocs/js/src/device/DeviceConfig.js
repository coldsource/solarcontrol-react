import {TimeRanges} from '../ui/TimeRanges.js';
import {SelectHTDevice} from '../ui/SelectHTDevice.js';
import {SliderDuration} from '../ui/SliderDuration.js';
import {Control} from './configparts/Control.js';
import {Meter} from './configparts/Meter.js';
import {Voltmeter} from './configparts/Voltmeter.js';
import {BatteryBackup} from './configparts/BatteryBackup.js';
import {BatteryPolicy} from './configparts/BatteryPolicy.js';
import {Offload} from './configparts/Offload.js';
import {Force} from './configparts/Force.js';
import {Input} from './configparts/Input.js';
import {Remainder} from './configparts/Remainder.js';
import {MinOnOff} from './configparts/MinOnOff.js';
import {HWS} from './configparts/HWS.js';
import {Thermometer} from './configparts/Thermometer.js';
import {Hygrometer} from './configparts/Hygrometer.js';
import {Tooltip} from '../ui/Tooltip.js';
import {ConfigBlock} from '../ui/ConfigBlock.js';

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
				config: {meter: {type: '3em', mqtt_id: '', phase: 'a'}},
				title: "Power Meter",
				renderTitle: (config) => "Power Meter : " + config.meter.type
			},
			Voltmeter: {
				render: this.renderVoltmeter,
				config: {voltmeter: {mqtt_id: '', thresholds: []}},
				title: "Voltmeter"
			},
			BatteryBackup: {
				render: this.renderBatteryBackup,
				config: {backup: {battery_low: 30, battery_high: 50, min_grid_time: 7200}},
				title: "Battery backup"
			},
			BatteryPolicy: {
				render: this.renderBatteryPolicy,
				config: {policy: "battery"},
				title: "Battery Policy"
			},
			Control: {
				render: this.renderControl,
				config: {control: {type: 'plug', ip: ''}},
				title: "Controller",
				renderTitle: config => "Controller : " + config.control.type,
			},
			ControlBattery: {
				render: this.renderControl,
				config: {control: {type: 'uni', ip: '', reverted: true}},
				options: {revert: true},
				title: "Controller",
				renderTitle: config => "Controller : " + config.control.type,
			},
			OffPeak: {
				render: this.renderInput,
				config: {input: {type: 'pro', mqtt_id: '', outlet: 0}},
				title: "Off Peak detection"
			},
			Offload: {
				render: this.renderOffload,
				config: {expected_consumption: 0, offload: []},
				title: "Offload"
			},
			OffloadTemperature: {
				render: this.renderOffload,
				config: {expected_consumption: 0, offload: []},
				options: {temperature: true},
				title: "Offload"
			},
			OffloadMoisture: {
				render: this.renderOffload,
				config: {expected_consumption: 0, offload: []},
				options: {moisture: true},
				title: "Offload"
			},
			Force: {
				render: this.renderForce,
				config: {force: []},
				title: "Forced period"
			},
			ForceTemperature: {
				render: this.renderForce,
				config: {force: []},
				options: {temperature: true},
				title: "Forced period"
			},
			ForceMoisture: {
				render: this.renderForce,
				config: {force: []},
				options: {moisture: true},
				title: "Forced period"
			},
			Remainder: {
				render: this.renderRemainder,
				config: {remainder: [], min_on_time: 0, min_on_for_last: 0},
				title: "Remainder"
			},
			MinOnOff: {
				render: this.renderMinOnOff,
				config: {min_on: 0, min_off: 0},
				title: "Device protection"
			},
			MinOnOffMax: {
				render: this.renderMinOnOff,
				config: {min_on: 0, min_off: 0, max_on: 0},
				options: {max_on: true},
				title: "Device protection"
			},
			Thermometer: {
				render: this.renderThermometer,
				config: {ht_device_id: 0},
				title: "Thermometer",
			},
			CMV: {
				render: this.renderCMV,
				config: {ht_device_ids: []},
				title: "Hygrometers"
			},
			HWS: {
				render: this.renderHWS,
				config: {min_energy: 0, min_energy_for_last: 0},
				title: "Remainder"
			},
			MQTT: {
				render: this.renderMQTT,
				config: {mqtt_id: ''}
			},
			BLE: {
				render: this.renderBLE,
				config: {ble_addr: ''}
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

	getPartKey(part) {
		if(part.substr(-1)=='*')
			return part.substr(0, part.length-1);
		return part;
	}

	buildDefaultConfig() {
		let config = {};
		for(const part of this.props.parts)
		{
			if(part.substr(-1)=='*') // Build default config only from required fields
				Object.assign(config, this.config_parts[this.getPartKey(part)].config);
		}
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

	enablePart(part) {
		let device = structuredClone(this.props.device);
		Object.assign(device.device_config, this.config_parts[part].config);
		this.props.onChange(device);
	}

	disablePart(part) {
		let device = structuredClone(this.props.device);
		for(const key in this.config_parts[part].config)
			delete device.device_config[key];
		this.props.onChange(device);
	}

	renderName(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Name of the device, only used by you">
						Name
					</Tooltip>
				</dt>
				<dd><input type="text" name="device_name" value={device.device_name} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderPrio(device, config, onChange) {
		return; // Prio is not rendered, it can be changer later from devices listing
	}

	renderMeter(device, config, onChange) {
		return (
			<Meter name="meter" value={config.meter} onChange={onChange} />
		);
	}

	renderVoltmeter(device, config, onChange) {
		return (
			<Voltmeter name="voltmeter" value={config.voltmeter} onChange={onChange} />
		);
	}

	renderBatteryBackup(device, config, onChange) {
		return (
			<BatteryBackup name="backup" value={config.backup} onChange={onChange} />
		);
	}

	renderBatteryPolicy(device, config, onChange) {
		return (
			<BatteryPolicy name="policy" value={config.policy} onChange={onChange} />
		);
	}

	renderControl(device, config, onChange, options = {revert: false}) {
		return (
			<Control name="control" value={config.control} onChange={onChange} revert={options.revert} />
		);
	}

	renderInput(device, config, onChange) {
		return (
			<Input name="input" value={config.input} onChange={onChange} />
		);
	}

	renderThermometer(device, config, onChange) {
		return (
			<Thermometer value={config} onChange={onChange} />
		);
	}

	renderCMV(device, config, onChange) {
		return (
			<Hygrometer value={config} onChange={onChange} />
		);
	}

	renderRemainder(device, config, onChange) {
		return (
			<Remainder value={config} onChange={onChange} />
		);
	}

	renderOffload(device, config, onChange, options = {}) {
		return (
			<Offload value={config} options={options} onChange={onChange} />
		);
	}

	renderForce(device, config, onChange, options = {}) {
		return (
			<Force value={config} onChange={onChange} options={options} />
		);
	}

	renderHWS(device, config, onChange) {
		return (
			<HWS value={config} onChange={onChange} />
		);
	}

	renderMinOnOff(device, config, onChange, options = {}) {
		return (
			<MinOnOff value={config} onChange={onChange} options={options} />
		);
	}

	renderMQTT(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="MQTT ID configured on the Shelly device.">
						MQTT ID
					</Tooltip>
				</dt>
				<dd>
					<input type="text" name="mqtt_id" value={config.mqtt_id} onChange={onChange} />
				</dd>
			</React.Fragment>
		);
	}

	renderBLE(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Bluetooth addres of the device.">
						Bluetooth address
					</Tooltip>
				</dt>
				<dd>
					<input type="text" name="ble_addr" value={config.ble_addr} onChange={onChange} />
				</dd>
			</React.Fragment>
		);
	}

	renderConfigParts() {
		return this.props.parts.map(part => {
			const device_config = this.props.device.device_config;

			const optional = part.substr(-1)!='*';
			part = this.getPartKey(part);

			const config = this.config_parts[part];
			const enabled = Object.keys(config.config).filter(value => !Object.keys(device_config).includes(value)).length==0
			const options = config.options!==undefined?config.options:{};

			if(config.title!==undefined)
			{
				let title = config.title;
				if(enabled && config.renderTitle!==undefined)
					title = config.renderTitle(device_config); // Custom title rendering function

				return (
					<ConfigBlock key={part} title={title} enabled={optional?enabled:null} onEnable={ () => this.enablePart(part) } onDisable={ () => this.disablePart(part) }>
						{config.render(this.props.device, device_config, this.change, options)}
					</ConfigBlock>
				);
			}

			return (
				<React.Fragment key={part}>
					{config.render(this.props.device, device_config, this.change, options)}
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
