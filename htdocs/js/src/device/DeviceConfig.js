import {TimeRanges} from '../ui/TimeRanges.js';
import {SelectHTDevice} from '../ui/SelectHTDevice.js';
import {SliderDuration} from '../ui/SliderDuration.js';
import {ConfigDeviceControl} from '../ui/ConfigDeviceControl.js';
import {ConfigDeviceMeter} from '../ui/ConfigDeviceMeter.js';
import {ConfigDeviceInput} from '../ui/ConfigDeviceInput.js';
import {Tooltip} from '../ui/Tooltip.js';

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
			Input: {
				render: this.renderInput,
				config: {meter: {type: 'pro', mqtt_id: '', outlet: 0}}
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
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="When offloading, highest priority devices will be switched on first if sufficient PV power is available. 0 is the highest priority.">
						Priority
					</Tooltip>
				</dt>
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

	renderInput(device, config, onChange) {
		return (
			<ConfigDeviceInput name="input" value={config.input} onChange={onChange} />
		);
	}

	renderExpectedConsumption(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="When offloading, the device will only be switched on if at least this power is available from PV. You can usually find this value on the device.">
						Expected consumption (W)
					</Tooltip>
				</dt>
				<dd><input type="number" name="expected_consumption" value={config.expected_consumption} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderHeater(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Themometer used to get current temperature.">
						Linked thermometer
					</Tooltip>
				</dt>
				<dd><SelectHTDevice type="temperature" name="ht_device_id" value={config.ht_device_id} onChange={onChange} /></dd>
				<dt>
					<Tooltip content="When in «&#160; forced mode&#160;», the heater will be switched on until this temperature is reached.">
						Forced mode target temperature (°C)
					</Tooltip>
				</dt>
				<dd><input type="number" name="force_max_temperature" value={config.force_max_temperature} onChange={onChange} /></dd>
				<dt>
					<Tooltip content="When in «&#160; offload mode&#160;», the heater will be switched on until this temperature is reached.">
						Offload mode target temperature (°C)
					</Tooltip>
				</dt>
				<dd><input type="number" name="offload_max_temperature" value={config.offload_max_temperature} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderCMV(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Hygrometer used to get current humidity.">
						Linked hygrometer
					</Tooltip>
				</dt>
				<dd><SelectHTDevice type="humidity" multiple="yes" name="ht_device_ids" value={config.ht_device_ids} onChange={onChange} /></dd>
				<dt>
					<Tooltip content="When in «&#160; forced mode&#160;», the CMV will be switched on until moisture is lower than this value or «&#160;Max on time&#160;» is reached.">
						Forced mode target moisture (%)
					</Tooltip>
				</dt>
				<dd><input type="number" name="force_max_moisture" value={config.force_max_moisture} onChange={onChange} /></dd>
				<dt>
					<Tooltip content="When in «&#160; offload mode&#160;», the CMV will be switched on until moisture is lower than this value or «&#160;Max on time&#160;» is reached.">
						Offload mode target moisture (%)
					</Tooltip>
				</dt>
				<dd><input type="number" name="offload_max_moisture" value={config.offload_max_moisture} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderRemainder(device, config, onChange) {
		let tooltip = "Compute how long this device has been turned on during the period represented by «\xa0For the last\xa0». If the device has been on for less than «\xa0Ensure minimum charging time of\xa0», it will be switched on in the period indicated by «\xa0During this period\xa0» to make the remainder.";
		return (
			<React.Fragment>
				<dt>
					<Tooltip content={tooltip}>
						Ensure minimum charging time of
					</Tooltip>
				</dt>
				<dd><SliderDuration name="min_on_time" value={config.min_on_time} onChange={onChange} /></dd>
				<dt>
					<Tooltip content={tooltip}>
						For the last
					</Tooltip>
				</dt>
				<dd><SliderDuration name="min_on_for_last" value={config.min_on_for_last} long={true} onChange={onChange} /></dd>
				<dt>
					<Tooltip content={tooltip}>
						During this period
					</Tooltip>
				</dt>
				<dd><TimeRanges name="remainder" value={config.remainder} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderOffload(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Time ranges when the device will be in «&#160;Offload&#160;» mode. In offload mode the device will be switched on only if sufficient PV power is available (see «&#160;Expected Consumption&#160;»). Leaf indicates offpeak hours if configured.">
						Offload
					</Tooltip>
				</dt>
				<dd><TimeRanges name="offload" value={config.offload} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderForce(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Time ranges when the device will be in «&#160;Forced&#160;» mode. In forced mode the device will be switched on whatever the current production is. Leaf indicates offpeak hours if configured.">
						Force
					</Tooltip>
				</dt>
				<dd><TimeRanges name="force" value={config.force} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderHWS(device, config, onChange) {
		let tooltip = "Compute how many energy has been taken by HWS during the period represented by «\xa0For the last\xa0». If HWS has taken less than «\xa0Ensure minimum Wh of\xa0», it will be switched on in the period indicated by «\xa0During this period\xa0» to make the remainder.";
		return (
			<React.Fragment>
				<dt>
					<Tooltip content={tooltip}>
						Ensure minimum Wh of
					</Tooltip>
				</dt>
				<dd><input type="number" name="min_energy" value={config.min_energy} onChange={onChange} /></dd>
				<dt>
					<Tooltip content={tooltip}>
						For the last
					</Tooltip>
				</dt>
				<dd><SliderDuration type="days" name="min_energy_for_last" value={config.min_energy_for_last} long={true} onChange={onChange} /></dd>
				<dt>
					<Tooltip content={tooltip}>
						During this period
					</Tooltip>
				</dt>
				<dd><TimeRanges name="remainder" value={config.remainder} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderMaxOn(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Once switched on, the device will always be switched off after this amount of time.">
						Maximum on time
					</Tooltip>
				</dt>
				<dd><SliderDuration name="max_on" value={config.max_on} onChange={onChange} /></dd>
			</React.Fragment>
		);
	}

	renderMinOnOff(device, config, onChange) {
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="Once switched on, the device will never be switched off before this amount of time. Use this to avoid too frequent on/off when offloading.">
						Minimum on time
					</Tooltip>
				</dt>
				<dd><SliderDuration name="min_on" value={config.min_on} onChange={onChange} /></dd>
				<dt>
					<Tooltip content="Once switched off, the device will never be switched on before this amount of time. Use this to avoid too frequent on/off when offloading.">
						Minimum off time
					</Tooltip>
				</dt>
				<dd><SliderDuration name="min_off" value={config.min_off} onChange={onChange} /></dd>
			</React.Fragment>
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
