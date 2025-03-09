export class SelectDeviceType extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="sc-select-devicetype">
				<dl className="legend">
					<dt>
						<i className="scf scf-plug2" onClick={() => this.props.onChange({target: {name: this.props.name, value: 'timerange'}})} />
					</dt>
					<dd>
						A timed controlled device that can manage forced or offload switching when energy is exported to grid. Can also be set up manually. This can be used for charging electrical devices when solar power is available.
					</dd>
					<dt>
						<i className="scf scf-heater" onClick={() => this.props.onChange({target: {name: this.props.name, value: 'heater'}})} />
					</dt>
					<dd>
						A timed controlled device similar to plug, but controlled by a thermometer. Can we used to control heaters.
					</dd>
					<dt>
						<i className="scf scf-fan" onClick={() => this.props.onChange({target: {name: this.props.name, value: 'cmv'}})} />
					</dt>
					<dd>
						A timed controlled device similar to plug, but controlled by an hygrometer. Can we used to control CMV.
					</dd>
					<dt>
						<i className="scf scf-meter" onClick={() => this.props.onChange({target: {name: this.props.name, value: 'passive'}})} />
					</dt>
					<dd>
						A metering only device used to monitor energy consumption. This is a read only device and cannot be controlled.
					</dd>
				</dl>
			</div>
		);
	}
}
