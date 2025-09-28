import {SelectLetter} from '../../ui/SelectLetter.js';
import {Tooltip} from '../../ui/Tooltip.js';

export class Voltmeter extends React.Component
{
	constructor(props) {
		super(props);

		this.change = this.change.bind(this);
		this.addThreshold = this.addThreshold.bind(this);
	}

	change(ev) {
		let config = Object.assign({}, this.props.value);

		const name = ev.target.name;
		let value = ev.target.value;

		config[name] = value;

		this.props.onChange({target: {name: this.props.name, value: config}});
	}

	addThreshold() {
		let thresholds = this.props.value.thresholds;
		thresholds.push({percent: '', voltage: ''});
		this.change({target: {name: 'thresholds', value: thresholds}});
	}

	removeThreshold(idx) {
		let thresholds = this.props.value.thresholds;
		thresholds = thresholds.splice(idx, 1);
		this.change({target: {name: thresholds, value: thresholds}});
	}

	changeThreshold(ev, idx) {
		let thresholds = this.props.value.thresholds;

		let value = '';
		if(ev.target.name=='percent')
			value = parseInt(ev.target.value);
		else if(ev.target.name=='voltage')
			value = parseFloat(ev.target.value);

		if(Number.isNaN(value))
			return;

		thresholds[idx][ev.target.name] = value;
		this.change({target: {name: 'thresholds', value: thresholds}});
	}

	renderThresholds() {
		return this.props.value.thresholds.map((threshold, idx) => {
			return (
				<div key={idx} className="threshold">
					<input type="number" name="percent" value={this.props.value.thresholds[idx].percent} onChange={ev => this.changeThreshold(ev, idx)} />
					<input type="number" name="voltage" value={this.props.value.thresholds[idx].voltage} onChange={ev => this.changeThreshold(ev, idx)} />
					<i onClick={() => this.removeThreshold(idx)} className="scf scf-cross" />
				</div>
			);
		});
	}

	render() {
		let value = this.props.value;
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="MQTT ID configured on the Shelly device.">
						Voltmeter MQTT ID
					</Tooltip>
				</dt>
				<dd><input type="text" name="mqtt_id" value={value.mqtt_id} onChange={this.change} /></dd>
				<dt>
					<Tooltip content="Configure voltage thresholds for detecting Stage Of Charge (SOC).">
						SOC
					</Tooltip>
				</dt>
				<dd>
					<div className="sc-voltmeter">
						<div className="threshold">
							<span><b>Percentage</b></span>
							<span><b>Voltage</b></span>
						</div>
						{this.renderThresholds()}
						<div onClick={this.addThreshold} className="add">Add threshold</div>
					</div>
				</dd>
			</React.Fragment>
		);
	}
}
