import {Tooltip} from '../../ui/Tooltip.js';

export class GridDetection extends React.Component
{
	constructor(props) {
		super(props);

		this.change = this.change.bind(this);
	}

	change(ev) {
		let config = Object.assign({}, this.props.value);

		const name = ev.target.name;
		let value = ev.target.value;

		config[name] = value;

		this.props.onChange({target: {name: this.props.name, value: config}});
	}

	render() {
		let value = this.props.value;
		return (
			<React.Fragment>
				<dt>
					<Tooltip content="MQTT ID configured on the detection device">
						Input MQTT ID
					</Tooltip>
				</dt>
				<dd>
					<input type="text" name="mqtt_id" value={value.mqtt_id} onChange={this.change} />
				</dd>
			</React.Fragment>
		);
	}
}
