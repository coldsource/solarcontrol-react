import {EnergyGlobal} from './EnergyGlobal.js';
import {EnergyDetail} from './EnergyDetail.js';
import {EnergyGraphDaily} from './EnergyGraphDaily.js';
import {EnergyGraphMonthly} from './EnergyGraphMonthly.js';
import {Modal} from '../ui/Modal.js';
import {DateOnly} from '../ui/DateOnly.js';
import {API} from '../websocket/API.js';

export class Energy extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
			day: false,
			graph_type: false,
			mbefore: -1,
			unit: 'kwh',
		};
	}

	renderGraph() {
		if(this.state.graph_type===false)
			return;

		if(this.state.graph_type=='monthly')
		{
			return (
				<Modal onClose={ () => this.setState({graph_type: false}) } title="Monthly summary">
					<EnergyGraphMonthly key={this.state.graph_type + "-" + this.state.mbefore} mbefore={this.state.mbefore} />
				</Modal>
			);
		}

		return (
			<Modal onClose={ () => this.setState({graph_type: false}) } title={(<DateOnly value={this.state.day} />)}>
				<EnergyGraphDaily key={this.state.graph_type} day={this.state.day} type={this.state.graph_type} />
			</Modal>
		);
	}

	renderTab() {
		if(this.state.day===false)
			return (<EnergyGlobal key={this.state.mbefore} mbefore={this.state.mbefore} unit={this.state.unit} onClickDay={day => this.setState({day: day})}/>);
		else
			return (<EnergyDetail day={this.state.day} />);
	}

	renderBackBtn() {
		if(this.state.day===false)
			return (<div></div>);

		return (
			<div>
				<i className="scf scf-arrow-left" onClick={ () => this.setState({day: false}) } />
			</div>
		);
	}

	renderDateBtn() {
		if(this.state.day===false)
		{
			return (
				<div>
					<span>
						<i className="scf scf-arrow-left" onClick={ () => this.setState({mbefore: this.state.mbefore + 1}) } />
					</span>
					<span>
						<i className={"scf scf-arrow-right" + (this.state.mbefore==-1?' disabled':'')} onClick={ () => this.state.mbefore>=0?this.setState({mbefore: this.state.mbefore - 1}):null } />
					</span>
				</div>
			);
		}
	}

	renderToolsBtn() {
		if(this.state.day===false)
		{
			return (
				<div>
					<span>
						<i className="scf scf-euro" onClick={ () => this.setState({unit: this.state.unit=='kwh'?'euro':'kwh'}) } />
					</span>
					<span>
						<i className="scf scf-graph" onClick={ () => this.setState({graph_type: 'monthly'}) } />
					</span>
				</div>
			);
		}

		return (
			<div>
				<span>
					<i className="scf scf-graph-mag" onClick={ () => this.setState({graph_type: 'detail'}) } />
				</span>
				<span>
					<i className="scf scf-graph" onClick={ () => this.setState({graph_type: 'global'}) } />
				</span>
			</div>
		);
	}

	render() {
		return (
			<div className="sc-energy">
				{this.renderGraph()}
				<div className="header">
					{this.renderBackBtn()}
					{this.renderDateBtn()}
					{this.renderToolsBtn()}
				</div>
				{this.renderTab()}
			</div>
		);
	}
}
