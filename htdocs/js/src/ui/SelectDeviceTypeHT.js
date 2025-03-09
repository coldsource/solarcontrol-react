export class SelectDeviceTypeHT extends React.Component
{
	constructor(props) {
		super(props);

		this.types = {
			'ht': 'scf-wifi',
			'htmini': 'scf-bluetooth',
			'wind': 'scf-wind'
		};
	}

	render() {
		return (
			<div className="sc-select-devicetype">
				<dl className="legend">
					<dt>
						<i className="scf scf-wifi" onClick={() => this.props.onChange({target: {name: this.props.name, value: 'ht'}})} />
					</dt>
					<dd>
						A Wifi controlled hyumidity and heat sensor.
					</dd>
					<dt>
						<i className="scf scf-bluetooth" onClick={() => this.props.onChange({target: {name: this.props.name, value: 'htmini'}})} />
					</dt>
					<dd>
						A Bluetooth controlled hyumidity and heat sensor.
					</dd>
					<dt>
						<i className="scf scf-wind" onClick={() => this.props.onChange({target: {name: this.props.name, value: 'wind'}})} />
					</dt>
					<dd>
						An anemometer controlled by shelly uni plus.
					</dd>
				</dl>
			</div>
		);
	}
}
