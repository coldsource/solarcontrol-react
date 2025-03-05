import {SolarControl} from './SolarControl.js';
import {LogsState} from '../logs/LogsState.js';
import {Temperatures} from './Temperatures.js';
import {Pricing} from './Pricing.js';
import {Subscreen} from '../ui/Subscreen.js';
import {DeviceElectrical} from '../device/DeviceElectrical.js';

export class Configs extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			screen: false,
			screen_name: ''
		};

		this.modules = [
			{name: 'Grid', icon: 'scf-electricity', value: 'grid'},
			{name: 'PV', icon: 'scf-sun', value: 'pv'},
			{name: 'HWS', icon: 'scf-droplet', value: 'hws'},
			{name: 'Temperatures', icon: 'scf-thermometer', value: 'temperatures'},
			{name: 'Pricing', icon: 'scf-euro', value: 'pricing'},
			{name: 'State logs', icon: 'scf-logs', value: 'logs'},
			{name: 'Advanced', icon: 'scf-cogs', value: 'advanced'},
		];
	}

	renderTiles() {
		return this.modules.map(module => {
			return (
				<div key={module.value} onClick={ () => this.setState({screen: module.value, screen_name: module.name}) }>
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
