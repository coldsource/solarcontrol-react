import {SolarControlTab} from './SolarControlTab.js';

export class SolarControl extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			module: 'energy'
		};

		this.modules = [
			{name: 'Energy', value: 'energy'},
			{name: 'Control', value: 'control'}
		];
	}

	renderModules() {
		return this.modules.map(module => {
			let cl = this.state.module==module.value?"selected":"";
			return (<li className={cl} key={module.value} onClick={() => this.setState({module: module.value})}>{module.name}</li>);
		});
	}

	render() {
		return (
			<div className="sc-solarcontrol">
				<ul className="sc-tabs">{this.renderModules()}</ul>
				<SolarControlTab key={this.state.module} module={this.state.module} />
			</div>
		);
	}
}
