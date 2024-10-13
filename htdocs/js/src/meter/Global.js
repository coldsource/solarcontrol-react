import {Meter} from '../websocket/Meter.js';

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

	formatPower(f) {
		if(f===undefined || f==='')
			return '';

		f = parseFloat(f);

		let unit = 'W';
		if(f>=1000)
		{
			f = f / 1000;
			unit = 'kW';
		}

		return f.toFixed(1) + unit;
	}

	formatEnergy(f) {
		if(f===undefined || f==='')
			return '';

		f = parseFloat(f);

		let unit = 'Wh';
		let digits = 0;
		if(f>=1000)
		{
			f = f / 1000;
			unit = 'kWh';
			digits = 1;
		}

		return f.toFixed(digits) + unit;
	}

	update(data) {
		this.setState(data);
	}

	render() {
		return (
			<div className="sc-meter-global">
				<div className="item">
					<div className="value">{this.formatPower(this.state.grid)}</div>
					<div className="label">Grid power</div>
				</div>
				<div className="item">
					<div className="value">{this.formatPower(this.state.pv)}</div>
					<div className="label">PV power</div>
				</div>
				<div className="item">
					<div className="value">{this.formatPower(this.state.net_available)}</div>
					<div className="label">Net available</div>
				</div>
				<div className="item">
					<div className="value">{this.formatPower(this.state.gross_available)}</div>
					<div className="label">Gross available</div>
				</div>
				<div className="item">
					<div className="value">{this.formatPower(this.state.total)}</div>
					<div className="label">Total consumption</div>
				</div>
				<div className="item">
					<div className="value">{this.formatPower(this.state.excess)}</div>
					<div className="label">Excess</div>
				</div>

				<div className="item">
					<div className="value">{this.formatEnergy(this.state.grid_energy)}</div>
					<div className="label">Imported</div>
				</div>
				<div className="item">
					<div className="value">{this.formatEnergy(this.state.grid_exported_energy)}</div>
					<div className="label">Exported</div>
				</div>
				<div className="item">
					<div className="value">{this.formatEnergy(this.state.pv_energy)}</div>
					<div className="label">Produced</div>
				</div>
				<div className="item">
					<div className="value">{this.formatEnergy(this.state.hws_energy)}</div>
					<div className="label">HWS</div>
				</div>
			</div>
		);
	}
}
