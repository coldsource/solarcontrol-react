import {SolarControl} from './SolarControl.js';
import {LogsState} from '../logs/LogsState.js';
import {Temperatures} from './Temperatures.js';
import {Pricing} from './Pricing.js';
import {Limits} from './Limits.js';
import {Stats} from './Stats.js';
import {Subscreen} from '../ui/Subscreen.js';
import {DeviceElectrical} from '../device/DeviceElectrical.js';
import {DeviceBattery} from '../device/DeviceBattery.js';
import {App} from '../app/App.js';
import {API} from '../websocket/API.js';
import {Config} from '../websocket/Config.js';

export class Configs extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			screen: false,
			screen_name: '',
			absence: false,
			priority: 'hws'
		};

		this.renderAbsence = this.renderAbsence.bind(this);
		this.renderPriority = this.renderPriority.bind(this);
		this.reloadConfig = this.reloadConfig.bind(this);

		this.modules = [
			{render: this.renderAbsence, value: 'absence'},
			{render: this.renderPriority, value: 'priority'},
			{name: 'Grid', icon: 'scf-electricity', value: 'grid'},
			{name: 'PV', icon: 'scf-sun', value: 'pv'},
			{name: 'Battery', icon: 'scf-battery', value: 'battery'},
			{name: 'HWS', icon: 'scf-droplet', value: 'hws'},
			{name: 'Temperatures', icon: 'scf-thermometer', value: 'temperatures'},
			{name: 'Pricing', icon: 'scf-euro', value: 'pricing'},
			{name: 'Limits', icon: 'scf-meter', value: 'limits'},
			{name: 'State logs', icon: 'scf-logs', value: 'logs'},
			{name: 'Statistics', icon: 'scf-stats', value: 'stats'},
			{name: 'Advanced', icon: 'scf-cogs', value: 'advanced'},
		];
	}

	componentDidMount() {
		Config.instance.Subscribe(this.reloadConfig);
	}

	componentWillUnmount() {
		Config.instance.Unsubscribe(this.reloadConfig);
	}

	reloadConfig(config) {
		this.setState({
			absence: config.control.GetBool('control.absence.enabled'),
			priority: config.control.Get('control.priority'),
		});
	}

	toogleAbsence() {
		let params = {
			module: 'control',
			name: 'control.absence.enabled',
			value: this.state.absence?'no':'yes'
		};

		API.instance.command('config', 'set', params).then(res => {
			if(params.value=='yes')
				App.message("Absence mode enabled");
			else
				App.message("Absence mode disabled");
		});
	}

	tooglePriority() {
		let params = {
			module: 'control',
			name: 'control.priority',
			value: this.state.priority=='hws'?'offload':'hws'
		};

		API.instance.command('config', 'set', params).then(res => {
			if(params.value=='hws')
				App.message("Priority set to HWS");
			else
				App.message("Priority set to Offload");
		});
	}

	renderAbsence() {
		let cl = this.state.absence?' on':'';
		return (
			<div key="absence" onClick={() => this.toogleAbsence()}>
				<i className={"scf scf-house-leave" + cl} />
				<span className={cl}>Absent</span>
			</div>
		);
	}

	renderPriority() {
		if(this.state.priority=='hws')
		{
			return (
				<div key="priority" onClick={() => this.tooglePriority()}>
					<span>HWS Priority</span>
				</div>
			);
		}

		return (
			<div key="priority" onClick={() => this.tooglePriority()}>
				<span>Offload Priority</span>
			</div>
		);
	}

	tileClick(module) {
		if(module.action!==undefined)
			return module.action();

		this.setState({screen: module.value, screen_name: module.name})
	}

	renderTiles() {
		return this.modules.map(module => {
			if(module.render!==undefined)
				return module.render();

			return (
				<div key={module.value} onClick={() => this.tileClick(module)}>
					<i className={"scf " + module.icon} />
					<span>{module.name}</span>
				</div>
			);
		});
	}

	renderSubscreen() {
		if(this.state.screen=='logs')
			return (<LogsState />);
		else if(this.state.screen=='advanced')
			return (<SolarControl />);
		else if(this.state.screen=='temperatures')
			return (<Temperatures />);
		else if(this.state.screen=='stats')
			return (<Stats />);
		else if(this.state.screen=='pricing')
			return (<Pricing />);
		else if(this.state.screen=='limits')
			return (<Limits />);
		else if(this.state.screen=='grid')
			return (<div className="sc-deviceconfig"><DeviceElectrical id="-1" /></div>);
		else if(this.state.screen=='pv')
			return (<div className="sc-deviceconfig"><DeviceElectrical id="-2" /></div>);
		else if(this.state.screen=='hws')
			return (<div className="sc-deviceconfig"><DeviceElectrical id="-3" parts={['Meter', 'Control']}/></div>);
		else if(this.state.screen=='battery')
			return (<div className="sc-deviceconfig"><DeviceBattery id="-4" parts={['Voltmeter', 'Meter', 'ControlBattery', 'BatteryPolicy*', 'BatteryBackup*', 'GridDetection']} /></div>);
	}

	render() {
		if(this.state.screen!=false)
		{
			return (
				<Subscreen title={this.state.screen_name} onClose={ () => this.setState({screen: false}) }>
					{this.renderSubscreen()}
				</Subscreen>
			);
		}

		return (
			<div className="sc-configs">
				{this.renderTiles()}
			</div>
		);
	}
}
