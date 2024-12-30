import {SolarControl} from './SolarControl.js';
import {LogsState} from '../logs/LogsState.js';
import {Temperatures} from './Temperatures.js';
import {Subscreen} from '../ui/Subscreen.js';

export class Configs extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			screen: false,
			screen_name: ''
		};

		this.modules = [
			{name: 'Settings', icon: 'scf-cogs', value: 'settings'},
			{name: 'State logs', icon: 'scf-logs', value: 'logs'},
			{name: 'Temperatures', icon: 'scf-thermometer', value: 'temperatures'},
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
		else if(this.state.screen=='settings')
			return (<SolarControl />);
		else if(this.state.screen=='temperatures')
			return (<Temperatures />);
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
