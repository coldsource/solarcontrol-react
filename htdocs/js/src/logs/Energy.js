import {EnergyGlobal} from './EnergyGlobal.js';
import {EnergyDetail} from './EnergyDetail.js';

export class Energy extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			tab: 'global'
		};

		this.tabs = [
			{name: 'Global', value: 'global'},
			{name: 'Daily', value: 'detail'}
		];
	}

	renderTab() {
		if(this.state.tab=='global')
			return (<EnergyGlobal />);
		else if(this.state.tab=='detail')
			return (<EnergyDetail />);
	}

	renderTabs() {
		return this.tabs.map(tab => {
			let cl = this.state.tab==tab.value?"selected":"";
			return (<li className={cl} key={tab.value} onClick={() => this.setState({tab: tab.value})}>{tab.name}</li>);
		});
	}

	render() {
		return (
			<div className="sc-configs">
				<ul className="sc-tabs">{this.renderTabs()}</ul>
				{this.renderTab()}
			</div>
		);
	}
}
