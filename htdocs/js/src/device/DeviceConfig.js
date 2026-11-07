import {TimeRanges} from '../ui/TimeRanges.js';
import {SelectHTDevice} from '../ui/SelectHTDevice.js';
import {SliderDuration} from '../ui/SliderDuration.js';
import {Control} from './configparts/Control.js';
import {Meter} from './configparts/Meter.js';
import {Voltmeter} from './configparts/Voltmeter.js';
import {BatteryBackup} from './configparts/BatteryBackup.js';
import {BatteryOffload} from './configparts/BatteryOffload.js';
import {BatteryPolicy} from './configparts/BatteryPolicy.js';
import {BatteryCharge} from './configparts/BatteryCharge.js';
import {OnBattery} from './configparts/OnBattery.js';
import {Offload} from './configparts/Offload.js';
import {Force} from './configparts/Force.js';
import {Input} from './configparts/Input.js';
import {Remainder} from './configparts/Remainder.js';
import {MinOnOff} from './configparts/MinOnOff.js';
import {HWS} from './configparts/HWS.js';
import {Thermometer} from './configparts/Thermometer.js';
import {HeatPump} from './configparts/HeatPump.js';
import {Hygrometer} from './configparts/Hygrometer.js';
import {GridDetection} from './configparts/GridDetection.js';
import {Tooltip} from '../ui/Tooltip.js';
import {ConfigBlock} from '../ui/ConfigBlock.js';

export class DeviceConfig extends React.Component
{
	constructor(props) {
		super(props);

		this.config_parts = {
			Name: {
				render: this.renderName,
				config: {},
				top: true
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
				config: {voltmeter: {mqtt_id: '', charge_delta: 0.5, thresholds: []}},
				title: "Voltmeter"
			},
			BatteryBackup: {
				component: BatteryBackup,
				config: {backup: {battery_low: 30, battery_high: 50, min_grid_time: 7200}},
				title: "Battery backup",
				tooltip: "Switch back to grid if battery SOC is too low"
			},
			BatteryOffload: {
				component: BatteryOffload,
				config: {offload: {soc_low: 90, soc_high: 98, max: "0"}},
				title: "Battery offload"
			},
			BatteryPolicy: {
				component: BatteryPolicy,
				config: {policy: "battery"},
				title: "Battery Policy"
			},
			BatteryCharge: {
				component: BatteryCharge,
				config: {charge: {soc_low: 40, soc_high: 80, timeranges: []}},
				title: "Grid charging",
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
				component: Input,
				config: {input: {type: 'pro', mqtt_id: '', outlet: 0}},
				title: "Off Peak detection"
			},
			GridDetection: {
				render: this.renderGridDetection,
				config: {input_grid: {type: 'grid', mqtt_id: ''}},
				title: "Grid failure detection"
			},
			Offload: {
				render: this.renderOffload,
				config: {expected_consumption: 0, offload: []},
				title: "Offload",
				tooltip: "Time ranges when the device will be in «\xa0Offload\xa0» mode. In offload mode the device will be switched on only if sufficient PV power is available (see «\xa0Expected Consumption\xa0»). Leaf indicates offpeak hours if configured."
			},
			OffloadTemperature: {
				render: this.renderOffload,
				config: {expected_consumption: 0, offload: []},
				options: {temperature: true},
				title: "Offload"
			},
			OffloadHeatPump: {
				render: this.renderOffload,
				config: {expected_consumption: 0, offload: []},
				options: {temperature: true, speed: true},
				title: "Offload"
			},
			OffloadMoisture: {
				render: this.renderOffload,
				config: {expected_consumption: 0, offload: []},
				options: {moisture: true},
				title: "Offload"
			},
			Force: {
				component: Force,
				config: {force: []},
				title: "Forced period",
				tooltip: "Time ranges when the device will be in «\xa0Forced\xa0» mode. In forced mode the device will be switched on whatever the current production is. Leaf indicates offpeak hours if configured."
			},
			ForceTemperature: {
				component: Force,
				config: {force: []},
				options: {temperature: true},
				title: "Forced period"
			},
			ForceHeatPump: {
				component: Force,
				config: {force: []},
				options: {temperature: true, speed: true},
				title: "Forced period"
			},
			ForceMoisture: {
				component: Force,
				config: {force: []},
				options: {moisture: true},
				title: "Forced period"
			},
			Remainder: {
				render: this.renderRemainder,
				config: {remainder: [], min_on_time: 0, min_on_for_last: 0},
				title: "Remainder",
				tooltip: "Compute how long this device has been turned on during the period represented by «\xa0For the last\xa0». If the device has been on for less than «\xa0Ensure minimum charging time of\xa0», it will be switched on in the period indicated by «\xa0During this period\xa0» to make the remainder."
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
				tooltip: "Themometer used to get current temperature for this device"
			},
			HeatPump: {
				render: this.renderHeatPump,
				config: {temperature_offset_slow: 0.5, temperature_offset_fast: 2.0, temperature_eco: 16.0, temperature_comfort: 20.0},
				title: "Heat Pump",
			},
			CMV: {
				render: this.renderCMV,
				config: {ht_device_ids: []},
				title: "Hygrometers",
				tooltip: "Hygrometer used to get current humidity for this device."
			},
			HWS: {
				render: this.renderHWS,
				config: {min_energy: 0, min_energy_for_last: 0},
				title: "Remainder"
			},
			MQTT: {
				render: this.renderMQTT,
				config: {mqtt_id: ''},
				top: true,
			},
			BLE: {
				render: this.renderBLE,
				config: {ble_addr: ''},
				top: true
			},
			OnBattery: {
				component: OnBattery,
				config: {battery: {enabled: false, controller_id: 0}},
				title: "Battery",
				tooltip: "Declare that this devices runs on battery. Offload will be computed based on battery state instead of exported power."
			},
		};

		this.int_fields = ['prio', 'expected_consumption', 'min_on_time', 'min_on_for_last', 'min_on', 'min_off', 'ht_device_id', 'max_on', 'min_energy_for_last'];
		this.float_fields = ['force_max_temperature', 'offload_max_temperature', 'force_max_moisture', 'offload_max_moisture'];

		this.change = this.change.bind(this);
	}

	componentDidMount() {
		let device = this.props.device;
		let default_config = this.buildDefaultConfig();

		if(this.props.device.device_config===undefined)
		{
			// Config is empty, init with default
			let device = this.props.device;
			device.device_config = default_config;
			this.props.onChange(device);
		}
		else
		{
			// Check we have a full config for backward compatibility (new configurations may exists in current version)
			let changed = false;
			for(const key in default_config)
			{
				if(device.device_config[key]===undefined)
				{
					device.device_config[key] = default_config[key];
					changed = true;
				}
			}

			if(changed)
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
			<div>
				<div><Tooltip content="Name of the device, only used by you">Name</Tooltip></div>
				<input type="text" name="device_name" value={device.device_name} onChange={onChange} />
			</div>
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

	renderControl(device, config, onChange, options = {revert: false}) {
		return (
			<Control name="control" value={config.control} onChange={onChange} revert={options.revert} />
		);
	}

	renderGridDetection(device, config, onChange) {
		return <GridDetection name="input_grid" value={config.input_grid} onChange={onChange} />
	}

	renderThermometer(device, config, onChange) {
		return (
			<Thermometer value={config} onChange={onChange} />
		);
	}

	renderHeatPump(device, config, onChange) {
		return (
			<HeatPump value={config} onChange={onChange} />
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
			<div>
				<div>
					<Tooltip content="MQTT ID configured on the Shelly device.">
						MQTT ID
					</Tooltip>
				</div>
				<input type="text" name="mqtt_id" value={config.mqtt_id} onChange={onChange} />
			</div>
		);
	}

	renderBLE(device, config, onChange) {
		return (
			<div>
				<div>
					<Tooltip content="Bluetooth addres of the device.">
						Bluetooth address
					</Tooltip>
				</div>
				<input type="text" name="ble_addr" value={config.ble_addr} onChange={onChange} />
			</div>
		);
	}

	renderConfigPart(config) {
		const options = config.options!==undefined?config.options:{};
		const device_config = this.props.device.device_config;

		if(config.component!==undefined && config.render===undefined)
		{
			let config_name = Object.keys(config.config)[0];
			return (<config.component name={config_name} value={device_config[config_name]} options={config.options} onChange={this.change} />);
		}

		return config.render(this.props.device, device_config, this.change, options);
	}

	renderConfigParts(top) {
		return this.props.parts.map(part => {
			const device_config = this.props.device.device_config;

			const optional = part.substr(-1)!='*';
			part = this.getPartKey(part);

			const config = this.config_parts[part];
			const enabled = Object.keys(config.config).filter(value => !Object.keys(device_config).includes(value)).length==0
			const options = config.options!==undefined?config.options:{};

			if(top && config.top===undefined)
				return;

			if(!top && config.top!==undefined && config.top)
				return;

			if(config.title!==undefined)
			{
				let title = config.title;
				if(enabled && config.renderTitle!==undefined)
					title = config.renderTitle(device_config); // Custom title rendering function

					return (
						<ConfigBlock key={part} title={title} tooltip={config.tooltip} enabled={optional?enabled:null} onEnable={ () => this.enablePart(part) } onDisable={ () => this.disablePart(part) }>
							{this.renderConfigPart(config)}
						</ConfigBlock>
				);
			}

			return (
				<React.Fragment key={part}>
					{this.renderConfigPart(config)}
				</React.Fragment>
			);
		});
	}

	render() {
		if(this.props.device.device_config===undefined)
			return; // Not initialized yet

		return (
			<React.Fragment>
				<div className="layout-form">
					{this.renderConfigParts(true)}
				</div>
				<dl>
					{this.renderConfigParts(false)}
				</dl>
			</React.Fragment>
		);
	}
}
