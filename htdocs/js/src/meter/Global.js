import {Meter} from '../websocket/Meter.js';
import {KWh} from '../ui/KWh.js';
import {KW} from '../ui/KW.js';

export class Global extends React.Component
{
	constructor(props) {
		super(props);

		this.state = {
		}

		this.update = this.update.bind(this);
	}

	componentDidMount() {
		this.meter = new Meter(this.update);
	}

	componentWillUnmount() {
		this.meter.disconnect();
	}

	update(data) {
		this.setState(data);
	}

	renderLeaf() {
		if(!this.state.offpeak)
			return;

		return (<i className="scf scf-leaf" />);
	}

	render() {
		return (
			<div className="sc-meter-global">
				<div className="item">
					<div className="value"><KW value={this.state.grid} /></div>
					<div className="label">Grid power {this.renderLeaf()}</div>
				</div>
				<div className="item">
					<div className="value"><KWh value={this.state.grid_energy} /></div>
					<div className="label">Imported</div>
				</div>
				<div className="item">
					<div className="value"><KW value={this.state.pv} /></div>
					<div className="label">PV power</div>
				</div>
				<div className="item">
					<div className="value"><KWh value={this.state.pv_energy} /></div>
					<div className="label">PV production</div>
				</div>
				<div className="item">
					<div className="value"><KW value={this.state.hws} /></div>
					<div className="label">HWS power</div>
				</div>
				<div className="item">
					<div className="value"><KWh value={this.state.hws_energy} /></div>
					<div className="label">HWS energy</div>
				</div>
				<div className="item">
					<div className="value"><KW value={this.state.net_available} /></div>
					<div className="label">Net available</div>
				</div>
				<div className="item">
					<div className="value"><KW value={this.state.gross_available} /></div>
					<div className="label">Gross available</div>
				</div>
				<div className="item">
					<div className="value"><KW value={this.state.total} /></div>
					<div className="label">Total consumption</div>
				</div>
				<div className="item">
					<div className="value"><KWh value={this.state.grid_exported_energy} /></div>
					<div className="label">Exported</div>
				</div>
			</div>
		);
	}
}
