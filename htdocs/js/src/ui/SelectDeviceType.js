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
						A timed controlled device linked to a thermometer. Will switch on to increase temperature. Can be used to control heaters. When absent, device will keep frost-free conditions and offload.
					</dd>
					<dt>
						<i className="scf scf-snow" onClick={() => this.props.onChange({target: {name: this.props.name, value: 'cooler'}})} />
					</dt>
					<dd>
						A timed controlled device linked to a thermometer. Will switch on to lower temperature. Can be used to control air-conditioner.  When absent, device is always off.
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
					<dt>
						<i className="scf scf-battery" onClick={() => this.props.onChange({target: {name: this.props.name, value: 'battery'}})} />
					</dt>
					<dd>
						A battery system used for power injection. Can be monitored for SOC (State Of Charge) and power injection.
					</dd>
					<dt>
						<i className="scf scf-battery-grid" onClick={() => this.props.onChange({target: {name: this.props.name, value: 'controller'}})} />
					</dt>
					<dd>
						A battery controller used to switch part of the network between grid and battery.
					</dd>
				</dl>
			</div>
		);
	}
}
