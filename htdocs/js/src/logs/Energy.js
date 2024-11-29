import {EnergyGlobal} from './EnergyGlobal.js';
import {EnergyDetail} from './EnergyDetail.js';
import {EnergyGraph} from './EnergyGraph.js';
import {Modal} from '../ui/Modal.js';

export class Energy extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			tab: 'global',
			graph_type: false,
		};

		this.tabs = [
			{name: 'Global', value: 'global'},
			{name: 'Daily', value: 'detail'},
		];
	}

	renderGraph() {
		if(this.state.graph_type===false)
			return;

		return (
			<Modal onClose={ () => this.setState({graph_type: false}) }>
				<EnergyGraph key={this.state.graph_type} type={this.state.graph_type} />
			</Modal>
		);
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
			<div className="sc-energy">
				{this.renderGraph()}
				<div className="header">
					<ul className="sc-tabs">{this.renderTabs()}</ul>
					<div>
						<i className="fa fa-chart-line" onClick={ () => this.setState({graph_type: this.state.tab}) } />
					</div>
				</div>
				{this.renderTab()}
			</div>
		);
	}
}
