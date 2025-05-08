import {SolarControl} from './SolarControl.js';
import {LogsState} from '../logs/LogsState.js';
import {Temperatures} from './Temperatures.js';
import {Pricing} from './Pricing.js';
import {Limits} from './Limits.js';
import {Subscreen} from '../ui/Subscreen.js';
import {DeviceElectrical} from '../device/DeviceElectrical.js';
import {App} from '../app/App.js';
import {API} from '../websocket/API.js';

export class Configs extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			screen: false,
			screen_name: '',
			config_control: {}
		};

		this.renderAbsence = this.renderAbsence.bind(this);

		this.modules = [
			{render: this.renderAbsence, value: 'absence'},
			{name: 'Grid', icon: 'scf-electricity', value: 'grid'},
			{name: 'PV', icon: 'scf-sun', value: 'pv'},
			{name: 'HWS', icon: 'scf-droplet', value: 'hws'},
			{name: 'Temperatures', icon: 'scf-thermometer', value: 'temperatures'},
			{name: 'Pricing', icon: 'scf-euro', value: 'pricing'},
			{name: 'Limits', icon: 'scf-meter', value: 'limits'},
			{name: 'State logs', icon: 'scf-logs', value: 'logs'},
			{name: 'Advanced', icon: 'scf-cogs', value: 'advanced'},
		];
	}

	componentDidMount() {
		this.reloadConfig();
	}

	reloadConfig() {
		API.instance.command('config', 'get', {module: 'control'}).then(res => {
			this.setState({config_control: res.config});
		});
	}

	toogleAbsence() {
		let params = {
			module: 'control',
			name: 'control.absence.enabled',
			value: this.state.config_control['control.absence.enabled']=='yes'?'no':'yes'
		};

		API.instance.command('config', 'set', params).then(res => {
			this.reloadConfig();
			if(params.value=='yes')
				App.message("Absence mode enabled");
			else
				App.message("Absence mode disabled");
		});
	}

	renderAbsence() {
		let absence = (this.state.config_control['control.absence.enabled']!==undefined && this.state.config_control['control.absence.enabled']=='yes');

		let cl = absence?' on':'';
		return (
			<div key="absence" onClick={() => this.toogleAbsence()}>
				<i className={"scf scf-house-leave" + cl} />
				<span className={cl}>Absent</span>
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
		else if(this.state.screen=='pricing')
			return (<Pricing />);
		else if(this.state.screen=='limits')
			return (<Limits />);
		else if(this.state.screen=='grid')
			return (<div className="sc-devicehws"><DeviceElectrical id="-1" /></div>);
		else if(this.state.screen=='pv')
			return (<div className="sc-devicehws"><DeviceElectrical id="-2" /></div>);
		else if(this.state.screen=='hws')
			return (<div className="sc-devicehws"><DeviceElectrical id="-3" parts={['Meter', 'Control']}/></div>);
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
